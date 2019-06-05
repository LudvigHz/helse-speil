import React, {useContext} from 'react'
import BehandlingerContext from '../../context/BehandlingerContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { behandlingerFor } from '../../io/http'
import './Search.css'

const Search = () => {
   const behandlingerCtx = useContext(BehandlingerContext)

   const keyTyped = (event) => {
      if (event.target.value.trim().length === 0) {
         return
      }
   
      const isEnter = (event.charCode || event.keyCode) === 13
      if (isEnter) {
         behandlingerFor(event.target.value)
            .then(response => {
               behandlingerCtx.setBehandlinger(response)
            })
            .catch(err => {
               console.log(err)
            })
      }
   }

   return (
      <div className="input-icon-wrap">
         <span className="input-icon">
            <FontAwesomeIcon icon={faSearch} />
         </span>
         <input
            type="text"
            className="input-with-icon"
            placeholder="FNR eller aktør"
            onKeyPress={keyTyped}
         />
      </div>
   )
}

export default Search

