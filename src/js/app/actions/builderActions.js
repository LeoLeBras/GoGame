class BuilderActions{


    /**
     * Constructor
     *
     */     
    constructor(){};





    /**
     * Run
     *
     */  
    run(){

        //Set size of $goban
        $goban::css({
            width: `${gobanSize}px`,
            height: `${gobanSize}px`
        });

        // Set size of $goban_gameply
        $goban_gameplay::width(gobanSize);
        $goban_gameplay::height(gobanSize);
        $goban_gameplay::css({
            width: `${gobanSize}px`,
            height: `${gobanSize}px`
        })

        // Set size of $goban_grid
        $goban_grid::width(gobanSize);
        $goban_grid::height(gobanSize);
        $goban_grid::css({
            width: `${gobanSize}px`,
            height: `${gobanSize}px`
        })

        // Draw the grid
        var c = $goban_grid_canvas.getContext('2d');
        for(var x = 1; x <= grid ; x++){
            c.beginPath();
            c.moveTo(cellSize, cellSize * x);
            c.lineTo(gobanSize - cellSize, cellSize * x);
            c.lineWidth = grid_border_width;
            c.strokeStyle = grid_border_color;
            c.stroke();
        }
        for(var y = 1; y <= grid ; y++){
            c.beginPath();
            c.moveTo(cellSize * y, cellSize);
            c.lineTo(cellSize * y, gobanSize - cellSize);
            c.lineWidth = grid_border_width;
            c.stroke();
        }

    }
}