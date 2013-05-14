(function generateNoise (alpha) {
    var canvas = document.createElement('canvas');
    if ( !!!canvas.getContext) {
        return false;
    }

    var ctx = canvas.getContext('2d'),
        x,y,
        r,g,b,
        a= alpha;

        canvas.width = 100;
        canvas.height = 100;

    for(x = 0; x< canvas.width; x++){
        for(y = 0; y< canvas.height; y++){
            r = Math.floor(Math.random() * 255);
            g = Math.floor(Math.random() * 255);
            b = Math.floor(Math.random() * 255);
            ctx.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';
            ctx.fillRect(x,y,1,1);
        }
    }
    document.body.style.backgroundImage = "url("+canvas.toDataURL("image/png")+')';
})(0.05);
//document.write('<script src="http://'+ (location.host || 'localhost').split(':')[0]+ ':35729/livereload.js"></script>');
// document.write('<script src="https://github.com/livereload/livereload-js/raw/master/dist/livereload.js?host=localhost"></script>');
