const formatMoney = (amount)=>{
    // return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return new Intl.NumberFormat('ja-JP').format(amount)
}

const formatNumber = (amount)=>{
    return new Intl.NumberFormat().format(amount)
}

const monthName = function(num){
    let month_list = [
        {code: "Jan", full:"January"}, 
        {code: "Feb", full:"February"}, 
        {code: "Mar", full:"March"}, 
        {code: "Apr", full:"April"}, 
        {code: "May", full:"May"}, 
        {code: "Jun", full:"June"}, 
        {code: "Jul", full:"July"}, 
        {code: "Aug", full:"August"}, 
        {code: "Sep", full:"September"}, 
        {code: "Oct", full:"October"}, 
        {code: "Nov", full:"November"}, 
        {code: "Dec", full:"December"},
    ];
    return month_list[num - 1];
};

export {formatMoney, formatNumber, monthName}