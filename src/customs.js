
export const FILEDOWNLOAD = (title, cssContent, htmlContent, scriptContent) => {
  return (
    `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    ${cssContent}
                </style>
            </head>
            <body>
                ${htmlContent}
                ${scriptContent?.map(item => item).join('')}
            </body>
        </html>`
  )
}

export const ALLCSS = `
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box
}
body{
margin: 0
}
    .main_container{
        background: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100vw;
        height: 100vh;
        max-width: 100%;
        overflow: hidden;
    }
    .section_content{
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .title_header{
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .content{
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .cta-button-container{
        padding: 1.25rem;
        position: fixed;
        bottom: 0px;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
    }
    .imgFull {
        width: 100%;
    }
    .max-w-half{
        width: 50%;
        max-width: 50%;
    }
        body::-webkit-scrollbar,
        html::-webkit-scrollbar{
            display: none;
        }
        #content::-webkit-scrollbar{
            height: 0;
            width: 0;
        }
        .pulse-button{
            cursor: pointer;
            animation: pulse 1s infinite;
        }

        @keyframes pulse{
            0%{
                transform: scale(1);
            }
            50%{
                transform: scale(1.1);
            }
            100%{
                transform: scale(1);
            }
        }

`


export const autoScrollCta = `
<script>
    (function () {
        const mraid = window.mraid || {};
        let isViewable = false;
        let scrollInterval;
        let isAutoScrolling = true;
    
        // Configuration Constants
        const SCROLL_SPEED = 1; // Pixels per tick
        const SCROLL_INTERVAL = 50; // Milliseconds
        const FALLBACK_DELAY = 1000; // Delay for non-MRAID environments
        const content = document.getElementById("content");
    
        // Utility: Starts auto-scrolling
        const startAutoScroll = () => {
            if (!isAutoScrolling) return;
            scrollInterval = setInterval(() => {
                content.scrollTop += SCROLL_SPEED;
                if (content.scrollHeight - content.scrollTop <= content.clientHeight) {
                    content.scrollTop = 0; // Reset scroll to top
                }
            }, SCROLL_INTERVAL);
        };
    
        // Utility: Stops auto-scrolling
        const stopAutoScroll = () => {
            isAutoScrolling = false;
            clearInterval(scrollInterval);
        };
    
        // Utility: Handles click actions
        const handleClickAction = () => {
          if (mraid.open && typeof mraid.open === "function") {
              mraid.open();
          } else {
              window.open();
          }
        };
    
        // Add click event listeners to specified selectors
        const addClickHandlers = (selectors) => {
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    element.addEventListener("click", (e) => {
                        e.preventDefault();
                        handleClickAction();
                    });
                });
            });
        };
    
        // Initialize scrolling and content visibility
        const initializeScrolling = () => {
            content.style.display = "block"; // Ensure content is visible
            if (isViewable && mraid.isViewable && typeof mraid.isViewable === "function" && mraid.isViewable()) {
                startAutoScroll();
            }
        };
    
        // Initialize MRAID functionality
        const initializeMraid = () => {
            if (mraid && typeof mraid.getState === "function") {
                const state = mraid.getState();
                if (state === "loading") {
                    mraid.addEventListener("ready", () => {
                        isViewable = true;
                        initializeScrolling();
                    });
                } else {
                    isViewable = true;
                    initializeScrolling();
                }
            } else {
                // Fallback for non-MRAID environments
                setTimeout(initializeScrolling, FALLBACK_DELAY);
            }
        };
    
        // Add user interaction event listeners to stop auto-scrolling
        const addUserInteractionListeners = () => {
            ["touchstart", "mousedown", "wheel"].forEach(eventType => {
                content.addEventListener(eventType, stopAutoScroll, { passive: true });
            });
        };
    
        // Initialization logic
        const initialize = () => {
            addClickHandlers([".cta"]);
            addUserInteractionListeners();
            initializeMraid();
        };
    
        // Start initialization when the DOM is ready
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initialize);
        } else {
            initialize();
        }
    })() </script>`


export const carouselVersion1 = `
 <script>
  const slider = document.querySelector('.slider');
      const prev = document.querySelector('#prev');
      const next = document.querySelector('#next');
      const dots_container = document.querySelector('.dots_container')
      const copySlider = [...slider?.children]
      const firstSlide = slider.firstElementChild.cloneNode(true);
      const lastSlide = slider.lastElementChild.cloneNode(true);
      slider?.appendChild(firstSlide);
      slider?.insertBefore(lastSlide, slider.firstElementChild);
      let timeout;
      let autoNextInterval;
      const totalItems = slider.children.length;
      let currentIndex = 1;
      let isTransitioning = false


      copySlider.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (currentIndex === i+1) dot.classList.add('active'); // Set the first dot as active
        dot.addEventListener('click', () => goToSlide(i + 1));
        dots_container?.appendChild(dot);
      });


      function goToSlide(i) {
        currentIndex = i
        updateCarousel()
      }

      function updateActiveDot() {
        document.querySelectorAll('.dot').forEach((dot, dotIndex) => {
          dot.classList.toggle('active', 
            dotIndex === currentIndex - 1 || 
            (dotIndex === 0 && currentIndex === totalItems - 1) ||
            (dotIndex === copySlider.length -1 && currentIndex <= 0)
          )
        });
      }

      function updateCarousel(){
        slider.style.transform = "translate(-" + (currentIndex * 100) + "%)"
        updateActiveDot()
      }

      slider.addEventListener("transitionend", () => {
      isTransitioning = false
      if (currentIndex >= totalItems - 1) {
        // If on the cloned last slide, jump back to real first slide
        slider.style.transition = "none";
        currentIndex = 1;
        updateCarousel();
      } else if (currentIndex <= 0) {
        // If on the cloned first slide, jump back to real last slide
        slider.style.transition = "none";
        currentIndex = totalItems - 2;
        updateCarousel();
      }
    });

    
    const nextSlide = () => {
      if(isTransitioning) return
        isTransitioning = true
        currentIndex++;
        slider.style.transition = "transform 0.5s ease-in-out";
        updateCarousel();
        resetInterval();
      };

      const prevSlide = () => {
        if(isTransitioning) return
        isTransitioning = true
        currentIndex--;
        slider.style.transition = "transform 0.5s ease-in-out";
        updateCarousel();
        resetInterval();
      };


      let touchStartX = 0;
      let touchEndX = 0;

      slider.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
      });

      const handleSwipe = () =>  {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
          if (difference > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }
      slider.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
      });
      prev?.addEventListener('click', prevSlide)
      next?.addEventListener('click', nextSlide)
      autoNextInterval = setInterval(nextSlide,2000)

      function resetInterval(){
        clearInterval(autoNextInterval)
        autoNextInterval = setInterval(nextSlide,2000)
      }
        </script>
`
export const carouselVersion1Css = `
    .carousel_container{
      position: relative;
      width: 100%;
      overflow-x: hidden;
    }
    .slider{
      display: flex;
      width: 100%;
      transition: transform 0.5s ease-in-out;
      transform: translate(-100%);
    }
    .card{
      width: 100%;
    }
    .carousel_btn_container{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
    }
    .carousel_btn_container button{
      background-color: transparent;
      border: none;
    }
    .dots_container{
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 10px 0;
    }
    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin: 5px;
      background-color: #e0e0e0;
      border-radius: 50%;
      cursor: pointer;
    }

    .dot.active {
      background-color: #9d9d9d;
    }
    .btn_rotate{
      transform: rotate(180deg);
    }
`

export const normalVideo = `
     .vid_container {
            width: 100%;
            margin: 0 auto;
            display: flex;
            justify-content: center;
        }

        .vid_container video {
            width: 100%;
        }
`

export const speedUpVideos = (speed = '.5') => {
  return `
    <script>
         const videos = document.querySelectorAll('.video')
              videos.forEach(video => {
            video.onloadedmetadata = function () {
                video.playbackRate = ${+speed}
            }
        })
    </script>
  `
}