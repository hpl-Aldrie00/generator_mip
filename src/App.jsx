import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import './App.css'
import { ALLCSS, autoScrollCta, FILEDOWNLOAD, carouselVersion1, carouselVersion1Css } from './customs'
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
    const boolHasNavBtn = JSON.parse(hasNavBtn)
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


  const generateHTML = (allHTML) => {
    setMainContainer(
      `<main class="main_container">
        <section id="content" class="section_content">
          ${allHTML}
        </section>
    </main>`)
  }
  const onSubmit = (e) => {
    console.log(allForms, 'click')
    e.preventDefault()
    let allHTML = ''
    let allClass = ''
    let newScripts = []
    allForms.forEach((item) => {

      const hasCta = item.imgName.includes('cta')
      const hasCarousel = item.class.includes('carousel_container')
      if (hasCta) {
        newScripts.push(autoScrollCta)
        allHTML += `<div class="${item.class}" onclick="mraid.open()">
        <img class="${item.imgName} imgFull max-w-half "/>
      </div>`;
      }
      else if (hasCarousel) {
        console.log(item)
        newScripts.push(carouselVersion1)
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
      }
      allClass += `.${item.imgName}{
        content: url('${item.file}')
      }`;

    })
    setCustomCSS(`${allClass} ${ALLCSS}`)
    setScripts(newScripts)
    generateHTML(allHTML)
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
    <main className='flex flex-col h-screen w-full overflow-hidden bg-red-950'>
      <h1 className='w-full flex justify-center mx-auto p-[20px] text-[20px] font-bold text-white'>HTML GENERATOR</h1>
      <section id='content' className='overflow-y-scroll flex w-full  '>
        <div className='flex flex-col mx-auto items-center w-1/2 h-full  p-[50px] text-[white] my-[50px] rounded-2xl'>
          <form className='flex flex-col w-full gap-10 mb-[20%]' onSubmit={onSubmit}>
            <label htmlFor=""> Site Name:
              <input className='ml-[5%] text-black' type="text" placeholder='input website title' value={titleText} onChange={(e) => setTitleText(e.target.value)} />
            </label>
            {allForms.length > 0 ? allForms.map((item, i) => (<AddComponent allForms={allForms} setAllForms={setAllForms} item={item} key={`NewComponent_${i}`} />)) : null}
            {allForms.length > 0 ? <button type='submit' className='border-2 rounded-2xl fixed bottom-0 left-[35%] w-1/4 h-[5rem] bg-white text-black'>SUBMIT</button> : null}
          </form>
          <button className='border-2 rounded-2xl w-1/2 p-[10px]' onClick={addInputComponents}>Add Component</button>
        </div>
      </section>
    </main>
  )
}

export default App
