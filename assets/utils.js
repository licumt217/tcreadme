let utils={
    /**
     * 字符型数字补零。
     * @param len 补零后的总位数
     * @param strNum 待补零的值
     * @returns {string}
     */
    fixZero:(len,strNum)=>{
        let zeroNum=len-strNum.length;
        let returnStr=''
        for(let i=0;i<zeroNum;i++){
            returnStr+='0'
        }
        return returnStr+strNum;
    }
    
    
    
}
module.exports=utils;