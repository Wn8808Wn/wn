function toRGB(_color){
    var color=_color;
    if(color.substr(0,1)=="#")color=color.substring(1);
    if(color.length!=6)return [0,0,0];
    var colorArr=new Array();
    var colorCode="0123456789abcdef";
    for(var x=0;x<3;x++){
        colorArr[0]=color.substr(x*2,2);
        colorArr[1]=colorArr[0].substr(0,1);
        colorArr[2]=colorArr[0].substr(1,1);
        colorArr[4+x]=colorCode.indexOf(colorArr[1])*16+colorCode.indexOf(colorArr[2])
    }
    return colorArr.splice(4,3);
}
function toRGBA(color,alpha){
    var rgbArr=toRGB(color);
    rgbArr.push(alpha>0 && alpha<1 ? alpha :1);
    return rgbArr;
}

module.exports={
    toRGB,
    toRGBA
}
