
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
        max-width: 100%;
        overflow: hidden;
    }
    .section_content{
        overflow-y: scroll;
    }
    .title_header{
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5;
    }
        

    .float {
      position: fixed;
      top: -1px;
      left: 0;
    }
    .title_header2 {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      visibility: hidden;
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
   document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.video');

  videos.forEach(video => {
    if (video.readyState >= 1) {
      video.playbackRate = ${speed};
    } else {
      video.onloadedmetadata = function () {
        video.playbackRate = ${speed};
      };
    }
  });
});
    </script>
  `
}

export const carouselVersion2 = `
  <script>
    const slider = document.querySelectorAll('.slider');
    const prev = document.querySelectorAll('#prev');
    const next = document.querySelectorAll('#next');
    const dots_container = document.querySelectorAll('.dots_container')

    let currentIndex = []

    slider.forEach((slide, sliderIndex) => {
      let timeout;
      let autoNextInterval;
      let totalItems = 0
      let isTransitioning = false
      const copySlider = [...slide?.children]
      currentIndex[sliderIndex] = 1

      const firstSlide = slide.firstElementChild.cloneNode(true);
      const lastSlide = slide.lastElementChild.cloneNode(true);
      slide?.appendChild(firstSlide);
      slide?.insertBefore(lastSlide, slide.firstElementChild);
      totalItems = slide.children.length;
      copySlider.forEach((_, i) => {
        const dot = document.createElement('div');
           dot.classList.add('dot', 'dot' + sliderIndex);
        if (currentIndex[sliderIndex] === i + 1) dot.classList.add('active'); // Set the first dot as active
        dot.addEventListener('click', () => goToSlide(i + 1));
        dots_container[sliderIndex]?.appendChild(dot);
      });

      function goToSlide(i) {
        currentIndex[sliderIndex] = i
        updateCarousel()
      }

      function updateActiveDot() {
        document.querySelectorAll('.dot' + sliderIndex).forEach((dot, dotIndex) => {
          dot.classList.toggle('active',
            dotIndex === currentIndex[sliderIndex] - 1 ||
            (dotIndex === 0 && currentIndex[sliderIndex] === totalItems - 1) ||
            (dotIndex === copySlider.length - 1 && currentIndex[sliderIndex] <= 0)
          )
        });
      }

      function updateCarousel() {
        slide.style.transform = "translate(-" + (currentIndex[sliderIndex] * 100) + "%)"
        updateActiveDot()
        console.log(currentIndex, 'currentIndexzxc')
      }

      slide.addEventListener("transitionend", () => {
        isTransitioning = false
        if (currentIndex[sliderIndex] >= totalItems - 1) {
          // If on the cloned last slide, jump back to real first slide
          slide.style.transition = "none";
          currentIndex[sliderIndex] = 1;
          updateCarousel();
        } else if (currentIndex[sliderIndex] <= 0) {
          // If on the cloned first slide, jump back to real last slide
          slide.style.transition = "none";
          currentIndex[sliderIndex] = totalItems - 2;
          updateCarousel();
        }
      });


      const nextSlide = () => {
        if (isTransitioning) return
        isTransitioning = true
        currentIndex[sliderIndex]++;
        slide.style.transition = "transform 0.5s ease-in-out";
        updateCarousel();
        resetInterval();
      };

      const prevSlide = () => {
        if (isTransitioning) return
        isTransitioning = true
        currentIndex[sliderIndex]--;
        slide.style.transition = "transform 0.5s ease-in-out";
        updateCarousel();
        resetInterval();
      };
      const onClickArr = ["touchstart", "mousedown", "touchend", "mouseup"]
      // const onReleaseArr = []

      let touchStartX = 0;
      let touchEndX = 0;

      onClickArr.forEach((eString, index) => {
        slide.addEventListener(eString, (e) => {
          const onTouch = e.touches[0]?.clientX
          const onTouches = e.changedTouches[0]?.clientX
          if (onTouch) {
            touchStartX = onTouch
          } else if (onTouches) {
            touchEndX = onTouches
          } else {
            touchStartX = e?.clientX
            touchEndX = e?.clientX
          }
        })
      })
      slide.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
      });
      slide.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
      });

      function handleSwipe() {
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

      prev[sliderIndex]?.addEventListener('click', prevSlide)
      next[sliderIndex]?.addEventListener('click', nextSlide)
      autoNextInterval = setInterval(nextSlide, 2000)

      function resetInterval() {
        clearInterval(autoNextInterval)
        autoNextInterval = setInterval(nextSlide, 2000)
      }

    })



  </script>
`

export const floatingVideoScript = `  <script>
    const floating_video_container = document.querySelector('.floating_video_container')
    const vid1 = document.querySelector('#vid1')
    const volume = document.querySelector('.volume')
    const title_header = document.querySelector('.title_header')

    window.addEventListener('scroll', () => {
      if (window.scrollY == 0) {
        floating_video_container.classList.remove('side')
        title_header.classList.add('hide')
      } else {
        floating_video_container.classList.add('side')
        title_header.classList.remove('hide')
      }
    })

    volume.addEventListener('click', () => {
      const isMuted = volume.classList.contains('mute')
      if (isMuted) {
        volume.classList.add('unmute')
        volume.classList.remove('mute')
        vid1.muted = false

      } else {
        volume.classList.add('mute')
        volume.classList.remove('unmute')
        vid1.muted = true
      }
    })
  </script>`

export const floatingVideoCss = `
    .mute {
      content: url('data:image/png;base64,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');
    }

    .unmute {
      content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAYAAADG4PRLAAAACXBIWXMAAC4jAAAuIwF4pT92AAAU/UlEQVR4nO2dfVhU1b7Hv8wMM4zoIKM4MCkgIJH4AtIxBF/Smy/c8mhmZWVWHiKhLDKKh3rqOQ/aQwlEml69Klpm1/R4k0i0Ao8Hyo6XwNdMRUTQkJfBYRTQgWFm3z8W5Diz9sAwa8Mofp6HR1xr770W+7fX2+9lLZf58+fjLsal41+uT2shIJK+rkAPkQDwAqACoATgCcADwICOHzdY/21GADc7fm4AuA5AB+AqgDoA9QAMwledLXeKAAcCCAQwAoAfiPBEdj5D3PGcgTz5HIAGAFUALgGoABGyU+PMAlQBGAMgGIA3bnWHQuEC8mF4AXiwI60OQBmA3wDUCFx+j3A2AQ4EEA4gDORF9jWqjp8pALQAjgM4BuBaH9bpNpxFgL4AogDcD9LVOSNKADMAPAzgPIBfAFzsywoBfS/AYABTQQR4pyAC+dDuB3AFQBGAM+ijmW5fCXAkgEdAJiV3MmoAi0DGxwKQltmr9LYAlQBmA3igl8sVGh8Az4MI8HsAmt4quLcEKAIQDTJ+uPZSmX3BKAABAH4C6VrbhS6wNwSoAvAEyFKgPyAG+VDHAPhfANVCFmbvYtgeXABEAngF/Ud45gwFEAsySRPsPQvVAmUAFuDuG+vsRQwyWfMHsAdEhccUIb6MoSCtrr8Lz5wgAMsgQE/EWoD+AF4GEeI9bmcwgL+BTHSYwVKAoQCWAJAzfObdhgzAcyDqQiawGgPDAMyHsJOiuwURyLuSAvg/Fg9zlHAAjzN6Vn/BBcCjACY5+iBHX/oYAPMgvKnnbmUOgAhHHuCIAANAFuj3Wl7PcQEwF0BITx/Q05evAlHiOqvp505CBOBJAMN7erO9yAE8C+J3cg82uIK800H23mivAEUAFoI4Ed2DLQMBPA07ezV7BTgFjBei97gNXwAz7bnBHgEOBzDdrurcoydMAvHA6xbdXci7gnSd/WbGGRoaqoyJiRlrMplMBQUFv588efJqLxXtAmII+AyAvquLxSEh3ZrBPgLiA9IviIqK8nn33Xdj/fz8Rvr5+fk//PDDD44ePXqgVqvV1tXV3eyFKshAHJTPdXVhdwToDaJp6ReLdRcXF6xatWqJXC4faJbmolKp1NOnT/9LcHCw28mTJy/r9XqjwFXxAVAJ4j3OS1ddYqfKp990nRKJRKRQKIbw5U+YMOGhDRs2vPbMM8+EClwVFwD/iS7efVctMBTEl6XfYDKZuOjo6OEeHh5KvmskEok0NDT0gfHjx3sUFxdfbGtrMwlUnYEg7v1X+C6wJUARgGdA+mKnJjExMTo+Pn7urFmzRptMpuvl5eU6R55XXFxcNmnSpJHu7u42F9ZeXl7eM2fOHFNTU3P5jz/+aHakTBuoAfwKgPqR2BJgOIAJAlWKGRkZGQvDw8MnymSyAYMGDfKIiIgYV1tbW1FVVdXjwJSbN28av/vuu2Nubm7XVSqVp1wud+e7ViqVuk2ePHmCXq+vOXfunLanZdpABhJRdZmWySdAEYCn4OTG2dWrVy8ICgoabZk+dOhQaX5+/hlHn3/ixInab7/9ttTDw6NlxIgR90kkEl6XyLCwsDESiaTx1KlT9Y6WS8EbQDEorZBPgKG4FaHjlGRmZj5JEx4A6HQ67Y8//vg7q7JKS0trDh06dDQkJEQxdOhQFd91o0ePDuE4TnP69OkGVmV3IAWZjVpFSPEJcB5IwKRTkpGRsTAwMJDXaaqhoaGORQs05+bNm8aCgoKzHMc1hISEBIrFYqoSZOzYsaMF6k6HgIyFt0GbovrAiWMWsrKynrIlPKHZvXv37ykpKRt1Oh2v+/yLL764KDg4mHUD8AKJKbkNmgAdshALSXp6+hP+/v7MNULh4eFea9euffaLL75IyMjIWDhjxgybH/CFCxeux8XFbdJoNLxBn++///4LLi7MdR9WsrHsQiUgeri+Djuz4pNPPul2y9NqtZrudqHBwcGDV65cGe/h4TFEJpMNUCqVXg899FBYVFSUWqvVaqqrq1to95lMJm7fvn1HZ8yYEUxbbkilUrfx48cPPnjwYJfqMDsYAuII9WfMhWULDIITGmrT09MXjBw5UhBd7Ny5c8e6uLhY9US+vr6jUlJS4t5+++1pfPdyHIdXX311a1NTE3W8CwkJGf/oo48GMKyuBBbuF5YVF1o9ZDdZWVlPBwUFCVYvjrMdlxkVFTV1w4YNL/j4+FAVGgaDwfT+++9/wfE86IUXXnjS1dWVpSpyjPl/RBa/BzMsyGEyMjKe8Pf3F7RO+/fvP8VxnE1VmLe3t29mZuYrfBOTqqqq5uzs7J20PFdXV+l77703m0VdOwiAWYieuQCHw4kW7pmZmQsDAwOp6zyWnD17Vrdy5cpNNTU1Vbauk8vlA1euXBkXFBREFWJeXt6FM2fOnKDljR8//kFvb29W71YCs9mouQC7bQUWmoyMjCcCAgJ6balw7NgxTUJCwvbdu3d/09zcrOO7TiqVuqWmpv5NLpdT/VZSU1Pz2tvbqZsFvfbaa48wqi5gJitzATrFRgPp6elP9EbLo7Fz587Tzz///GfHjh0r5rtGLpe7p6enL6Ll6fV6Y25u7n5aXmhoaJhKpWLVCv06f+lcRogAPIY+9vPMzMx8ksUi3Z5lBI3CwsILbW1ttePGjRtDW8spFApPtVptOnLkyCXLvJMnT9bNmTMn1M3NzWrS4+PjIyoqKqroab3McAfZ5sTY2QK9QPRtzJDL5WKZTCbq6sfV1VU0ePBgaVZW1lMBAQE99lBmzd69e8vWrFmzjS9/6tSp00eMGEG1Uuzduzeflj5mzJjxjKonAtGY/blg51XQ2ktycvL00NDQUFdXVynf1NocjuMgkUjEUqm0VydQkydPVre1tRmLi4vr+K4pLCz8Y8CAAV/FxcU9R8tPSkqa+8Ybb3xtmZ6bm1u+ePFivaur621raplMJp8yZcp9P/30E4u4eW8AVUwFuGLFiimRkZGTWTxLKEJCQga/8847T3t6eg4DgCtXrlTt37//cF5e3gXa9QcOHKgICwv7ZeLEiVGWeb6+vqMiIiKGlZaWWpmQSkpKfp00adIUy/TZs2eHMxLgMODWJIZJRG1kZGQki+cISWJi4uOdwgMAtVrtFxsb+2xqauqjfPekpaUdvHbtGtWtcMmSJf9BSz9w4MApWvqIESNYTRaHALcEyOv/YQ8SiYTpOMoasVjs4uXl5UPLGzt27IQ1a9Y8w3fvli1bcmjpvr6+QQEBAQrL9FOnTl1tbGy06p4VCsWQcePG8TpN2YEncEuAdgdV0Ghvbxd8YxtHMBqN3I0bN5r48n19fYP4WuLPP/98pbGxkWptnzdv3jha+rlz56hbb0VGRvp3o7pdoQDgIgIRotM7LrFi+/btubbyx44dO2Hy5MlqWl5+fv7PtHR/f3+q+enSpUtUm6GXlxeL4CAxALkITqQ+6w3y8/OrVq1a9d8ajYbXVW/p0qWP0dILCgou0GbWfN1yVVUVddxUKpWsorvk/ar1dVJaWlofFxeXXVxcfJiW7+npqZo5c6afZbpGo9FXVVVZdYtyudw9KirKSogVFRU6msDd3d35tn22lwGdXWi/JC0t7Z9lZWXU2WJ0dDRVnVddXU21wgcHB1stxWpra2/SbIVyuZxVrycS4e7ePbBLNm/efIiWrlarqd2iRqOh+psqFAqqUK5du6azTJNIJDI7qmgLVxH6eZx7eXn5NdoaT6lUqhQKhdXH3dLSQg35kslkVKEYDAYr64RYLGb1zkUidCMG7W5Hq9Va+XGKxWKJUqm0ci/R6/VUc5FEIqEORSaTycpYLBKJWAmwrd+Of+Z4eHhYGWlNJpPx+vXrbZbpUqmU6vBlMpmoel+RSGRlzuA4jlVoGicC0MroYXckarV6gFKptNpFUKfTNWi1Wqt34+7uTu0q9Xq9lbABgOaObzQaWQmwTQSA6jbXX1i6dCk1fK6mpoa6Thw6dKiV2gwAmpqaqJG7CoXC6no+q30PaBGBnBfk1CowoYiNjZ0QERFBVcCXlJRQ/Tl9fHyG0dIrKyuttC5DhgyR0YJF9Xo9q41fb3T259fBSKF9J6BSqeRJSUkxfO6Kzc3N13JycqwW7IMGDXINCAiw8pJra2vTFxYW/mGZHhgYOJg2YWlpaWHR690A0N4pwEb0EwFOmDDBKykp6XlbMX+7du3Ko6VPnz7dTywWW41pGo2m1mg0Wk1i/Pz8qO+0sbFRZ0eV+dABt7QwjQweeEeQkJAw35bwLl68eG7fvn1U425MTAx1vLx8+bJV6wMAX19f6vlPDQ0NLN53I3BLgEwOqmC4QBUEFxcXeHp68h6qdfXq1doVK1bspuWFhIR4ent7U42xP/zwA1UdN2rUKKqr5tGjR6nRtnZSB9wSIK9fiD3QFq3OBMdxaGpq0tHyKisrz8fHx2fz3ZuYmDifll5fX199/PhxK0VAYGCgQqVSWe1A2NzcfO3IkSMsjrK7TYA1YHB40+nTp6meyc7E5s2b97a1tf2pfWpubtbl5ubue/PNN782GAzUDzAuLu5BmjAAYM+ePQdp6XPmzKEqw2tqali0PgCoBW55pd0EOb3SoTP7Pvzwwx9WrVrlFhgYeD9tsKfBcRwEiKPj5fDhwzVlZWWfTZs2zd9gMBj37dtXTpuAdBIeHu4VExMTQ8vTaDRX8vPzqS75kyZNeoiWXlhYyOIjb0bHGGiuFroEBwVoMBhMycnJe1UqlXzQoEFSPvWSORzHcQqFQrZ8+fLHhwwZ0isnvGg0Gv2ePXvOdnVdcHDw4JSUlBf58tetW5dDS582bdpwd3d36gI+Ly+PhWPvnx+NuQAvglF0bl1d3U079xRrio+Pz16/fv1SPut2bzNx4kTvFStWPGfp29nJiRMnSvg2wFu0aBE1DuL8+fOnGVXvz4MnzZXZ5ejD47oNBoNp+fLlW+vq6qhT8t4kISFhYkpKyssymYzqrdDY2Fj/97///QAtLyYmJsDb25vqI/P5558XMapieecv5gK8AYFP2uqK1tZW07Jly7bZ8lcRkmnTpg1fv379kpkzZ/LG83Ecx6Wmpv4PX/7ixYv/Sku/dOnS+bKyMhZn7zaAnOcLwNqdglUTd4jXX3/986tXr/baqdFeXl5uq1ateiwxMfEltVpt5QtjTlZW1rbKykqqa2JycvL0AQMGUF00N2zY8AOLugK4bf8bmgD7rBvtRK/XG5ctW5ZtaxcIVqjV6gGffvrpstDQ0C6Pw1m7du02Prf4iIiIYXxhBRUVFWfPnj3LStt1m9LAUoA6kNlon9Pe3s7Fx8dna7XaWiHLWbBgwTi+VtNJc3OzLi0tbfOhQ4eo47Obm5v4rbfeWkzL4zgOH3300Xcs6gqgHhZKF5pFvpRRYQ5jNBq52NjYzUKOie7u7jY9xMrKyk4tXbp0fXFxMe+HlJWVtZhPv5qTk5Or0WhYua1YyYYmwNNwIj8ZjuOQkJCwtaGhQZDutKCggDru63Q6zZdffrk7OTk5h09DA5CgVD4daXV19cXt27ez0k4ZABy3TKQJ0AAnaoUA6U47xkTms+TS0tL6bdu27bx+/frV9vb2Nq1WW7tnz56cl156aeM333xjc5OejIyMhXxBqUaj0fDBBx/8g2FVT4JozG6Db0emX0DOv3Ua64LRaOTi4uK2Zmdnv0zzYXGE3Nzc8tzc3HKlUimj+cFY4ubmJv7444+f9vX15d0YYu3atV9251ndhANA9SLn80prAuCUiumEhARBWiIAdOeFR0dH+2zcuDHOlvDy8vLyioqKWNbxDMj6zwpbboX/AiD0zux209raaoqLi9tqa4khFosFcZdMSkqalpSUFOvh4cEbEHvw4MGCLVu2HGVYLAfgn3yZtv5QHZxsLDQnPj4+u76+nu8rZ2reiImJGZmdnf1ydHT0VFvXFRUVHVq3bt2/WZYN4DeQ5QOVrnYlPARgHJxwAzyj0ci98sorWzdt2hRrqQAvKio6zqKMOXPmjJw1a9ZfurPR3oEDBw5s2rSphEW5ZhgA/Gjrgq6OHTCAdKNBDCvFlPz8/BOhoaGKwYMHK1tbW1v279//465duxzebnn16tULZs2a9Yinp6fN/QNMJpPxq6++2rNjxw6qW4WD/ATAptnLZf78+V09RASBzkBniZeXl1tjY2Nre3u7w6rAtLS0v4aEhHS5p0tNTU3V2rVrv2OoJjNHC2A9SCPipTsbu5oA5ACIgxPHErLSdri6uoq6I7yioqJDWVlZ1JBrBnAAvkUXwgO6vzPvFZDmzLv56d2CyWTi9Hp9i5ubG1U1VlFRcXbHjh3/OnbsGBNPPh6KYWa0tUV3Ty8DiJI7CGR3hLsWjuNgNBqvhoWF3baxanV1deXu3bvz1q1bd7i2tpaVazwNDYBd4DmpxRJ79sY2AvgHgHg44ayUJTk5OWUtLS3bIyMj7+c4jispKSn//vvvu9UiHMQAYDe60XV20p1JjCXBAJ5DPzmOrpfZA6Lz7DY9mZSUwYZm4B495t+wU3hAz2eVRT0p7B68nAXQI5eLngqQA7AXZt5R9+gxl0DmFj0KS3BkXWcEsBNmTqb3sJsrAHbAjkmLJY4uzA0AvoKT+NHcYdQA2A4HvR9YaFb0HRVh4TLeX7gMYBuIL65DsFKNtYF0Bb8xet7dTBmAL8DI74jlIVftIINxIwCrrYbvAYCoyPajhxMWGqxPKeMA5IPErs0D453w72DaAeRBAAO5UMfMnQKxIj8FB0PW7gIaQdRjgvjxCGkeqgOwEaTb6HN3/T7iBID/goBBQ0If9GgAsA9E0zAXHRt19wOaQP5upuf40rDHnOQIWgBHQfxM74MTG4YdxATS43yNjhh2oenNo1bbQPR9vwKYDaDPDjIWiAqQiYqQhl4r+uKsXC2ICk4NYuEPwZ1tmjoPoBB9pI3qy8OOr4AIchiAqSBHi94pXSsHMr4VgqjE+gxnOK26HsSQeRBkk4VwMDqIRABaQGaWJeBxde9tnEGAnTQCKAAxFgeCtMgH0PfuG60AzoGoCcvhZFtzOpMAOzGBjCvnAeSCnFYZBHL4rzeE72Y5kF7hAojAKuFkQjPHGQVojhFkdtdp6ZCBHNbsAyLMYSDbZPZUZWcAafn1INP+GhBLgdMEuHaFswvQklaQlmG5HaQ7iLvjQJCjhKQgXW/n7JYDEYoBxIRzA8A1kC2r7mj+H9bJpL9Em2KCAAAAAElFTkSuQmCC');
    }
    .floating_video_container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      right: 0;
      transition: transform 0.5s ease-in;
      z-index: 6;
      height: 100vh;
      background-color: white;
      width: 100%;
    }

    .volume_container {
      display: flex;
      justify-content: end;
      position: absolute;
      bottom: 5%;
      right: 5%;
    }

    .volume {
      width: 50%;
    }

    #vid1 {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .side {
      width: 30%;
      height: 30%;
      position: fixed;
      top: 25% !important;
      right: 0 !important;

    }

    .side video {
      object-fit: cover !important;
    }

    .hide {
      display: none;
    }`
