import React, { useEffect, useState, version } from 'react';

const AddComponent = ({ allForms, setAllForms, item }) => {
  const [currName, setCurrName] = useState(0);
  const [carouselStructure, setCarouselStructure] = useState({
    version: '',
    hasNavBtn: true,
    Btnfile: '',
    passive: '#e0e0e0',
    active: '#9d9d9d'
  })
  const [carouselVersion, setCarouselVersion] = useState(0);
  const optionVal = [0, 1, 2, 3];
  const dropChoice = ['header', 'content', 'cta', 'carousel'];
  const carouselVersionArr = ['v1', 'v2',];
  const dropChoiceClass = ['title_header', 'content', 'cta-button-container pulse-button cta', 'carousel_container'];


  const updateAllForms = (update) => { // update main files
    const updatedForms = allForms.map((form) => {
      if (form.id === item.id) return update
      return form
    });
    setAllForms(updatedForms);
  }

  const handleFileChange = async (e) => {
    const addFile = {
      ...item,
      file: await convertToBase64(e.target.files[0]),
      class: dropChoiceClass[currName],
      imgName: e.target.name,
    }
    updateAllForms(addFile)
  };

  const addMultipleImage = async (e) => {
    const multiFilesCarousel = {
      ...item,
      class: dropChoiceClass[currName],
      hasNavBtn: carouselStructure.hasNavBtn,
      carouselFiles: await multipleConvertToBase64(e.target.files)
    };
    updateAllForms(multiFilesCarousel)
  }

  const addBtnImg = async (e) => {
    setCarouselStructure({ ...carouselStructure, Btnfile: await convertToBase64(e.target.files[0]) })
  }

  const deleteFile = () => {
    const findId = item.id
    const newForms = allForms.filter(item => item.id !== findId)
    setAllForms(newForms)
  }

  useEffect(() => {
    const updatedForms = { ...item, class: dropChoiceClass[currName] };
    updateAllForms(updatedForms)
  }, [currName])

  useEffect(() => {
    const updatedForms = { ...item, ...carouselStructure };
    updateAllForms(updatedForms)
  }, [carouselStructure])

  const multipleConvertToBase64 = async (files) => {
    return Promise.all(
      Array.from(files).map(item => convertToBase64(item))
    )
  }

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        alert('Please upload a file first.');
        return;
      }

      const reader = new FileReader();

      reader.onload = function (event) {
        const base64String = event.target.result.split(',')[1];
        resolve(`data:${file.type};base64,${base64String}`); // Returning the base64 string in an array
      };

      reader.onerror = function (error) {
        reject('Error reading file: ' + error);
      };

      reader.readAsDataURL(file);
    });
  }
  return (
    <section className='w-full flex h-full text-black border-b-2 border-black '>
      <div className='w-[50%]'>
        <label htmlFor="" >Select a component to add and it's image
          <select className='bg-transparent mx-[10px]'
            onSelect={(e) => setCurrName(e.target.value)}
            onChange={(e) => setCurrName(e.target.value)}

          >
            {
              dropChoice.map((item, i) => (
                <option key={`${item}${i}`} value={optionVal[i]}>{item}</option>
              ))
            }
          </select>
        </label>
        {
          currName != 3 ?
            <input
              type="file"
              name={`${dropChoice[currName]}_${item.id}`}
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            /> : null
        }
        {
          currName == 3
            ? (<div className='ml-[20%] flex'>
              <div className='w-full flex flex-col gap-10'>
                <label htmlFor="">select carousel version and add carousel images
                  <select className=''
                    onSelect={(e) => setCarouselStructure({ ...carouselStructure, version: e.target.value })}
                    onChange={(e) => setCarouselStructure({ ...carouselStructure, version: e.target.value })}
                  >
                    {
                      carouselVersionArr.map((item, i) => (
                        <option key={`${item}${i}`} value={item}>{item}</option>
                      ))
                    }
                  </select>
                </label>
                <input
                  type="file"
                  multiple
                  name={`${carouselVersionArr[currName]}_${item.id}`}
                  accept="image/png, image/jpeg"
                  onChange={addMultipleImage}
                />
                <div>
                  <span>does it have navigation bar and button</span>
                  <input type="radio" id='hasNavBtn' name="hasNavBtn" value={true} className='mr-[5px]'
                    onSelect={(e) => setCarouselStructure({ ...carouselStructure, hasNavBtn: e.target.value })}
                    onChange={(e) => setCarouselStructure({ ...carouselStructure, hasNavBtn: e.target.value })}
                  />
                  <label htmlFor="">yes</label>
                  <input type="radio" id='hasNavBtn' name="hasNavBtn" value={false} className='mr-[5px]'
                    onSelect={(e) => setCarouselStructure({ ...carouselStructure, hasNavBtn: e.target.value })}
                    onChange={(e) => setCarouselStructure({ ...carouselStructure, hasNavBtn: e.target.value })}
                  />
                  <label htmlFor="">no</label>
                  {
                    JSON.parse(carouselStructure.hasNavBtn) ?
                      <div className='flex flex-col gap-5'>
                        <label> input arrow pointed to the left image
                          <input
                            type="file"
                            name={`Btnfile`}
                            accept="image/png, image/jpeg"
                            onChange={addBtnImg}
                          />
                        </label>
                        <div className='flex flex-col gap-5'>
                          <label htmlFor="">not active dot color sample #e0e0e0
                            <input className=' text-black' type="text" onChange={(e) => setCarouselStructure({ ...carouselStructure, passive: e.target.value })} />
                          </label>
                          <label htmlFor="">active dot color sample #e0e0e0
                            <input className=' text-black' type="text" onChange={(e) => setCarouselStructure({ ...carouselStructure, active: e.target.value })} />
                          </label>
                        </div>
                      </div>
                      : null
                  }
                </div>
              </div>
            </div>
            )
            : null
        }
      </div>
      <div onClick={deleteFile} className='w-[200px] flex items-center justify-center border-2 border-black'>
        Delete Component
      </div>
    </section>
  );
};

export default AddComponent