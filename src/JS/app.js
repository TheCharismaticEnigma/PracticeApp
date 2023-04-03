'use strict' ;

class Controller { 
    #state ; 
    #errorMessage ; 
    #parentElement = document.getElementById("resultContainer") ;
    #trigger = document.querySelector(".form__btn") ; 

    constructor() { 
        // {}, this->{}, this.__proto = Controller.prototype, returns {} 
        
        this.#initialize() ; 
    }

    #initialize() { 
        this.#setData() ; 

        const element = this.#trigger ;
        
        if (!element) 
             return ; 

        element.addEventListener("click", (event) => {
            event.preventDefault() ; // default behavior of submission. 
            this.#renderData() ;
        }) ;

    }

    #areValidSearches() { 
        const inputs = document.querySelectorAll(".form__input") ; 
        let allValid = true ; 

        inputs.forEach(input => {
            if (input.value.trim().length < 1) {
                allValid = false ; 
                return allValid ; 
            }
        }) ; 

        return allValid   ; 
    }

    // Methods are set on the prototype & properties on the instance. 

    async #setData() { 
        try {
            const response = await fetch(
                `https://www.balldontlie.io/api/v1/players`
            ) || null ; 

            if (!response.ok)
                throw new Error("Some Error Occurred. Refresh the page or try again later.") ; 

            const {data} = await response.json() ; 
            this.#state = data ; 
        }

        catch(error) { 
            this.#errorMessage = error.message ; 
        }
    }; 

    #resetInputs() { 
        document.querySelectorAll(".form__input")
                .forEach(input =>{
                    input.value = "" ; 
                }) ;
    }

    #validSearchResults() { 
        const searchedPlayerName = document.getElementById("playerName")?.value.toLowerCase().trim() || null; 
        const searchedTeamName = document.getElementById("teamName")?.value.toLowerCase().trim() || null ; 

        this.#resetInputs() ; 

        if (!searchedPlayerName || !searchedTeamName)
             return this.#errorMessage ; 

        let HTMLContent = '<p>Match not found! Please ensure that the player and team names are unerring. </p>' ; 

        this.#state?.forEach(data => { 
            const {first_name} = data ; 

            const {full_name: fullTeamName, 
                   name: shortTeamName} = data.team ; 

            if (searchedPlayerName === first_name.toLowerCase() && 
                searchedTeamName === shortTeamName.toLowerCase()) {
               
                HTMLContent = `<p>${first_name} does play in the ${fullTeamName}. And he's doing a terrific job at it! </p>`
                return HTMLContent ; 
            }
        }) || "not loaded" ; 

        return HTMLContent ; 
    }

    #renderData() { 

        if (!this.#areValidSearches()) { 
            alert("PLEASE FILL ALL THE INPUT FIELDS~") ; 
            this.#parentElement.innerHTML = "" ; 
            return ; 
        }

        let innerHTML = ""; 

        if (this.#errorMessage)
            innerHTML = `<p id="errorMessage">${this.#errorMessage}</p>` ; 

        // If search values match one of the result, render the result. Else render another message. 
        else innerHTML = this.#validSearchResults() ;
        
        this.#parentElement.innerHTML = "" ; 
        this.#parentElement.insertAdjacentHTML("afterbegin", innerHTML) ; 
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller() ; 
}); 

// DOMContentLoaded is called when HTML is completely parsed and the deferred scripts and 
// modules have been downloaded and executed. 
// DOESNT WAIT for things like images and async scripts to finish loading. 