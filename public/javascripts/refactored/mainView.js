var MainView = function(){
  var cvs,
      ctx,
      counter;

  function init (){
    initCanvas();
    drawCalibrateLine();
  }

  function initCanvas(){
    cvs = document.getElementById('cvs');
    ctx = cvs.getContext('2d');
    cvs.width = screen.width;
    cvs.height = screen.height;
  }

  function drawCalibrateLine(){
    ctx.beginPath();
    ctx.moveTo(0,cvs.height/2);
    ctx.lineTo(cvs.width,cvs.height/2);
    ctx.moveTo(cvs.width/2,0);
    ctx.lineTo(cvs.width/2,cvs.height);
    ctx.stroke();
  }

  function drawWaitingMessage(){
    ctx.fillStyle = "black";
    ctx.font = "100px san-serif";
    ctx.rotate(Math.PI);
    ctx.translate(-1500,-800);
    ctx.fillText("Now loading...",400,400);
    ctx.translate(1500,800);
    ctx.rotate(-Math.PI);
  }

  function draw(image){
   ImageConverter.drawImage(image,cvs,ViewConfig.conf());
  }

  return {
    init:init,
    draw:draw,
  };

  }();