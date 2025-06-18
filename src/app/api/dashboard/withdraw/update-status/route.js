import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { getWithdrawStatus } from "@/utils/payments/payments";


// it can handle up to 1000 pending transactions


// Configuration for performance tuning
const BATCH_SIZE = 50; // Process in batches to avoid overwhelming the API
const MAX_CONCURRENT_REQUESTS = 10; // Limit concurrent API calls
const REQUEST_TIMEOUT = 30000; // 30 second timeout for API calls

export async function GET() {
  try {
    const withdraws = await fetchWithdraws();
    if (!Array.isArray(withdraws) || withdraws.length === 0) {
      return NextResponse.json({ 
        message: "No withdraws to process", 
        count: 0 
      });
    }

    console.log(`Processing ${withdraws.length} withdraws`);
    
    // Process in batches to avoid overwhelming the system
    const batches = createBatches(withdraws, BATCH_SIZE);
    const allResults = [];
    
    for (const batch of batches) {
      const batchResults = await processBatch(batch);
      allResults.push(...batchResults);
      
      // Optional: Add small delay between batches to be API-friendly
      if (batches.indexOf(batch) < batches.length - 1) {
        await sleep(100); // 100ms delay between batches
      }
    }

    // Filter successful updates and failed ones
    const successful = allResults.filter(r => r.success);
    const failed = allResults.filter(r => !r.success);

    console.log(`Updated: ${successful.length}, Failed: ${failed.length}`);

    return NextResponse.json({ 
      message: "Batch processing completed",
      summary: {
        total: withdraws.length,
        successful: successful.length,
        failed: failed.length
      },
      failedUpdates: failed.length > 0 ? failed : undefined
    });

  } catch (err) {
    console.error("Withdraw update error:", err);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }, { status: 500 });
  }
}

async function fetchWithdraws() {
  const { data, error } = await supabaseAdmin
    .from("withdraws")
    .select("transfer_id, status") // Also select current status for comparison
    .in("status", ["pending", "IN_TRANSIT"])
    .order("created_at", { ascending: true }) // Process older requests first
    .limit(1000); // Add reasonable limit to prevent memory issues

  if (error) {
    console.error("Fetch error:", error);
    throw new Error(`Database fetch failed: ${error.message}`);
  }
  
  return data || [];
}

function createBatches(array, batchSize) {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

async function processBatch(batch) {
  // Limit concurrent requests within each batch
  const semaphore = new Semaphore(MAX_CONCURRENT_REQUESTS);
  
  const promises = batch.map(async (withdraw) => {
    return semaphore.acquire(async () => {
      return processWithdraw(withdraw);
    });
  });

  return Promise.all(promises);
}

async function processWithdraw(withdraw) {
  try {
    // Add timeout to prevent hanging requests
    const status = await Promise.race([
      getWithdrawStatus(withdraw.transfer_id),
      timeoutPromise(REQUEST_TIMEOUT)
    ]);

    // Skip update if status hasn't changed
    if (status === withdraw.status) {
      return {
        transfer_id: withdraw.transfer_id,
        success: true,
        action: 'skipped',
        reason: 'status_unchanged'
      };
    }

    // Update database
    const { error } = await supabaseAdmin
      .from("withdraws")
      .update({ 
        status,
      })
      .eq("transfer_id", withdraw.transfer_id);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    return {
      transfer_id: withdraw.transfer_id,
      success: true,
      action: 'updated',
      old_status: withdraw.status,
      new_status: status
    };

  } catch (error) {
    console.error(`Failed to process withdraw ${withdraw.transfer_id}:`, error.message);
    
    return {
      transfer_id: withdraw.transfer_id,
      success: false,
      error: error.message
    };
  }
}

// Utility classes and functions
class Semaphore {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.current = 0;
    this.queue = [];
  }

  async acquire(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.current >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.current++;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.current--;
      this.process();
    }
  }
}

function timeoutPromise(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}