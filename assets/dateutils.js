let dateutils={
    plusHours:(date,hours)=>{
        let originalHours=date.getHours()
        hours+=originalHours;
        date.setHours(hours)
        return date;
    }
}
module.exports=dateutils;