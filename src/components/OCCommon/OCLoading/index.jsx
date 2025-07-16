import './index.css';
export default function OCLoading(props){ 
    const text = "Loading..."
    return(
      <div className="oc-loading">
        <div className='oc-loading-content'>
          <ul className='oc-loading-group'>
          {
            text.split("").map((char, index) => {
              const animationDelay = `${index * 0.5}s`;
              return(
                <span key={index} i={index} style={{animationDelay}}>{char}</span>
              )
            })
          }
          </ul>
        </div>
      </div>
    )
}