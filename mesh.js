(function(ext) {
    // All of this code except one URL change (substituted wmsinh for scratchx in
// the line ‘https://wmsinh.firebaseio.com') is from technoboy10.  Original 
// repository here: https://github.com/technoboy10/mesh/tree/gh-pages
    $.ajax({

        async:false,

        type:'GET',

        url:'https://cdn.firebase.com/js/client/2.2.4/firebase.js',

        data:null,
        
        success: function(){fb = new Firebase('https://wmsinh.firebaseio.com');console.log('ok');}, //Create a firebase reference

        dataType:'script'

    });
    window['temp'] = 0; // init
    
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };
    
    ext.broadcast = function(name) {
        if (name.length > 0){ // blank broadcasts break firebase - not nice.
        window['sent-' + name] = Math.random();
        fb.child('broadcasts/' + name).set(window['sent-' + name]); //Change value of broadcast so other clients get an update
        }
    };
    
   ext.mesh_hat = function(name) {
       fb.child('broadcasts/' + name).on('value', function(snap){window['new-' + name] = snap.val();console.log(name);}); // Make sure broadcasts are unique (don't activate twice)
       if(window['last-' + name] != window['new-' + name] && window['new-' + name] != window['sent-' + name]){
           window['last-' + name] = window['new-' + name];
           return true;
       } else {
           return false;
       }
   }
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'mesh broadcast %s', 'broadcast'],
            ['h', 'when I receive mesh %s', 'mesh_hat']
        ],
        url: 'http://technoboy10.tk/mesh'
    };


    // Register the extension
    ScratchExtensions.register('Mesh', descriptor, ext);
})({});
