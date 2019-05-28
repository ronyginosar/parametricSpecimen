// // console.clear();
//
// var centerVertice = "40,0,0";
//
// // CONSOLE LOG MANAGER
// var entry;
// function logManager(logEntry){
//   if (entry != logEntry){ // don't print if didn't change
//     console.log("log: " + logEntry); // added string to diff between console and manager
//     entry = logEntry;
//   }
// }
//
// // TOGGLE VAR MANAGER
// function toggleCheck() {
//   if(document.getElementsByName("toggle")[0].checked === true){
//     console.log("TRUE");
//     centerVertice = "40,0,0";
//   } else {
//     console.log("ELSE");
//     centerVertice = "80,40,4";
//   }
//   letterGrid.init();
//   letterGrid.animate();
// }
//
// // CHANGE FONT ON HOVER
// $(document).mouseover(function(e){
//   if($(e.target).css('opacity')!=0){ // only if curently displaying
//     var targetSettings = $(e.target).css('font-variation-settings');
//     if (targetSettings){
//       if (targetSettings != "normal") logManager(targetSettings);
//       document.body.style.setProperty('font-variation-settings' , targetSettings );
//     }
//   }
// });
//
// // CHANGE LETTER ON INPUT
// $('#messageInputBox').on('input',function(e){
//     message = ($(this).val());
//     logManager("new message: " + message);
//     $.each(letterinstances, function( index, value ) {
//       value.element.textContent = message;
//     });
// });
