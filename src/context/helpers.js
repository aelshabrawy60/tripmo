export default function checkSubscriptionValid(expirationDate, isFreeTrail) {
    const currentDate = new Date();
    expirationDate = new Date(expirationDate);
  
    if (currentDate > expirationDate) {
      return { isvalid: false, warning: null };
    }
  
    return { isvalid: true, warning: null };
  }
  