// ItinerarySteps.jsx
import React, { useRef, useEffect, useState } from 'react'
import ItineraryStep from '../ItineraryStep/ItineraryStep';


function ItinerarySteps({steps}) {
    const containerRef = useRef(null);
    const [lineHeight, setLineHeight] = useState(0);
    const [lineLeft, setLineLeft] = useState(0);

    useEffect(() => {
        const calculateLineHeight = () => {
            if (containerRef.current) {
                const stepElements = containerRef.current.querySelectorAll('.itinerary-step');
                if (stepElements.length > 1) {
                    const firstCircle = stepElements[0].querySelector('.step-circle');
                    const lastCircle = stepElements[stepElements.length - 1].querySelector('.step-circle');
                    
                    // Calculate total height from first step's center to last step's center
                    const firstStepCenter = stepElements[0].offsetTop + (firstCircle.offsetHeight / 2);
                    const lastStepCenter = stepElements[stepElements.length - 1].offsetTop + (lastCircle.offsetHeight / 2);
                    setLineHeight(lastStepCenter - firstStepCenter);
                    
                    // Calculate the exact center position of the circles on x-axis
                    const circleLeft = firstCircle.offsetLeft + (firstCircle.offsetWidth / 2);
                    setLineLeft(circleLeft);
                } else if (stepElements.length === 1) {
                    setLineHeight(0); // No line needed for single step
                }
            }
        };

        // Calculate on mount and when content changes
        calculateLineHeight();

        // Recalculate on window resize (in case text wrapping changes)
        const handleResize = () => {
            setTimeout(calculateLineHeight, 100); // Small delay to ensure layout is complete
        };

        window.addEventListener('resize', handleResize);
        
        // Use ResizeObserver if available for more accurate detection
        let resizeObserver;
        if (containerRef.current && window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
                setTimeout(calculateLineHeight, 50);
            });
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [steps]); // Recalculate when steps change

    return (
        <div className='relative' ref={containerRef}>
            {lineHeight > 0 && (
                <div 
                    className='w-1 bg-tripmo-500 absolute z-0' 
                    style={{ 
                        height: `${lineHeight}px`, 
                        left: `${lineLeft}px`,
                        transform: 'translateX(-50%)',
                        top: '24px' // Offset to start from center of first circle
                    }}
                ></div>
            )}
            {steps.map((step, index) => (
                <div key={index} className='mb-6 z-10 relative itinerary-step'>
                    <ItineraryStep data={step} stepNumber={index + 1}/>
                </div>
            ))}
        </div>
    )
}

export default ItinerarySteps