class SaveActions{


    /**
     * Constructor
     *
     */   
    constructor(){}




    /**
     * Update the backup
     *
     */  
    update(){

        // Save chains object
        let seen = [];
        sessionStorage.setItem('chains', JSON.stringify(chains, function(key, val) {
           if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        }));

        // Save rocks object
        seen = [];
        sessionStorage.setItem('rocks', JSON.stringify(rocks, function(key, val) {
           if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        }));

    }
}