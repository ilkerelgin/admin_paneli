const  i18n = require("../i18n");

class I18n {
    constructor(lang){
        this.lang = lang;
    }


    translate(text,lang=this.lang){

        let arr = text.split(".");

        let val = i18n[lang][arr[0]];

        for(let i = 1;i<arr.length;i++){
            val = val[arr[i]]; 
        }



        return i18n[lang][text];
    }
}

module.exports = i18n;