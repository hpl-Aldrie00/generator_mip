import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import './App.css'
import { ALLCSS, autoScrollCta, FILEDOWNLOAD, carouselVersion1, carouselVersion1Css, normalVideo, speedUpVideos, carouselVersion2 } from './customs'
import AddComponent from './AddComponent'

function App() {
  const [allForms, setAllForms] = useState([])
  const [titleText, setTitleText] = useState('')
  const [customCSS, setCustomCSS] = useState(ALLCSS)
  const [scripts, setScripts] = useState([])
  const [structure, setStructure] = useState([])
  const [mainContainer, setMainContainer] = useState()

  // const generateComponent = (componentName) => {
  //   const generateComponentObj = {
  //     header:
  //     <header class='headings_container'>
  //       <img  />
  //     </header>
  //   }
  // }

  const generateCarousel = (item) => {
    const { hasNavBtn = true, carouselFiles, id } = item
    return (`
    <section class="carousel_container">
            <div class="slider">
            ${carouselFiles.map((item, i) => {
      return (
        ` <img class="slide${i + 1} card"  alt="Slide ${i + 1}"/>`
      )
    }).join('')
      }
            </div>
           ${!!hasNavBtn ? `<div class="carousel_btn_container">
            <button id="prev" class="">
              <img class="btn_carousel max-w-[40px]" alt="Previous"/>
            </button>
            <button id="next" class="btn_rotate">
                <img class="btn_carousel" alt="Next"/>
            </button>
          </div>` : ''}
         
    </section>
    ${!!hasNavBtn ? `<div class="dots_container"></div>` : ''}
    `)
  }

  const generateVideo = (item) => {
    const { video } = item

    return (`
      <div class="vid_container">
        <video class="video" muted autoplay loop>
          <source src=${video} />
        </video>
      </div>

      `)
  }


  const generateHTML = (allHTML, header) => {
    setMainContainer(
      `<main class="main_container">
      ${header}
        <section id="content" class="section_content">
          ${allHTML}
        </section>
    </main>`)
  }


  const onSubmit = (e) => {
    console.log(allForms, 'click')
    e.preventDefault()
    let header = ''
    let allHTML = ''
    let allClass = ''
    let newScripts = []
    let hasVidScript = false
    let hasCarouselScript = false
    allForms.forEach((item) => {

      const hasCta = item.imgName.includes('cta')
      const hasCarousel = item.class.includes('carousel_container')
      const hasVid = item.class.includes('vid_container')
      const hasHeader = item.class.includes('header')
      const hasFloatingVideo = item.class.includes('floating_video_container')
      if (hasHeader || hasFloatingVideo) {
        header += `
        `
      }
      else if (hasCta) {
        newScripts.push(autoScrollCta)
        allClass += `.${item.imgName}{
          content: url('${item.file}')
        }`;
        allHTML += `<div class="${item.class}" onclick="mraid.open()">
        <img class="${item.imgName} imgFull max-w-half "/>
      </div>`;
      }
      else if (hasVid) {
        allHTML += generateVideo(item)
        if (item?.slowdown != '1' && !hasVidScript) {
          newScripts.push(speedUpVideos(item?.slowdown))
          hasVidScript = true
          allClass += normalVideo;
        }
      }
      else if (hasCarousel) {
        if (!hasCarouselScript) {
          newScripts.push(carouselVersion2)
          hasCarouselScript = true
        }
        allHTML += generateCarousel(item)
        allClass += carouselVersion1Css;
        allClass += `
        .dot{
          background-color: ${item?.passive}
        }
        .dot.active{
          background-color: ${item?.active}
        }
        .btn_carousel{
        content: url('${item?.Btnfile}')
        }
        `
        item?.carouselFiles.forEach((item, i) => {
          allClass += `.slide${i + 1}{
            content: url('${item}')
          }`;
        })
      }
      else {
        allHTML += `<div class="${item.class}">
        <img class="${item.imgName} imgFull" />
        </div>`;
        allClass += `.${item.imgName}{
          content: url('${item.file}')
        }`;
      }

    })
    setCustomCSS(`${allClass} ${ALLCSS}`)
    setScripts(newScripts)
    generateHTML(allHTML, header)
    if (mainContainer) generateAndDownload()
  }



  function generateAndDownload() {
    // Get the HTML and CSS input values
    const blob = new Blob([FILEDOWNLOAD(titleText, customCSS, mainContainer, scripts)], { type: 'text/html' });
    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated_page.html';

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  }


  const addInputComponents = () => {
    setAllForms([...allForms, { id: v4(), file: '', class: '', imgName: '' }])
  }


  return (
    <main className='flex flex-col h-screen w-full overflow-hidden text-black bg-gray-400'>
      <h1 className='w-full flex justify-center mx-auto p-[20px] text-[20px] font-bold'>MIP GENERATOR</h1>
      <section id='content' className='overflow-y-scroll flex w-full'>
        <div className='flex flex-col mx-auto w-full h-full  p-[50px] text-[white] my-[50px] rounded-2xl'>
          <form className='flex flex-col w-1/2 gap-10 pb-[50px]' onSubmit={onSubmit}>
            <label htmlFor="" className='text-black  p-[20px] border-2 border-black rounded-xl'> Site Name:
              <input className='ml-[10px] text-black outline outline-1 outline-black' type="text" placeholder='input website title' value={titleText} onChange={(e) => setTitleText(e.target.value)} />
            </label>
            {allForms.length > 0 ? allForms.map((item, i) => (<AddComponent allForms={allForms} setAllForms={setAllForms} item={item} key={`NewComponent_${i}`} />)) : null}
            <div className='flex justify-center items-center fixed top-[50%]  left-[52%] mx-auto border-2 border-black rounded-2xl w-[300px] h-[5rem] p-[10px] text-black' onClick={addInputComponents}>Add Component</div>
            {allForms.length > 0 ? <button type='submit' className='border-2 rounded-2xl fixed top-[50%] right-[10%]  w-[300px] h-[5rem]  text-black'>SUBMIT</button> : null}
          </form>
        </div>
      </section>
    </main>
  )
}

export default App
