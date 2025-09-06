class HydraulicFloorGenerator {
    constructor() {
        this.selectedColor = '#2c3e50';
        this.gridRows = 10;
        this.gridCols = 12;
        this.init();
    }

    init() {
        this.createGrid();
        this.setupColorPalette();
        this.setupTileInteraction();
        this.setupGridSizeControls();
    }

    createGrid() {
        const grid = document.getElementById('floor-grid');
        grid.innerHTML = '';
        
        for (let row = 0; row < this.gridRows; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'floor-row';
            
            if (row % 2 === 1) {
                rowElement.classList.add('offset');
            }
            
            for (let col = 0; col < this.gridCols; col++) {
                const tile = document.createElement('div');
                tile.className = 'hex-tile';
                tile.dataset.row = row;
                tile.dataset.col = col;
                
                rowElement.appendChild(tile);
            }
            
            grid.appendChild(rowElement);
        }
    }

    setupColorPalette() {
        const colorOptions = document.querySelectorAll('.color-option');
        
        colorOptions[0].classList.add('selected');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedColor = option.dataset.color;
            });
        });
    }

    setupTileInteraction() {
        const grid = document.getElementById('floor-grid');
        let isMouseDown = false;

        grid.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('hex-tile')) {
                isMouseDown = true;
                this.paintTile(e.target);
            }
        });

        grid.addEventListener('mouseover', (e) => {
            if (isMouseDown && e.target.classList.contains('hex-tile')) {
                this.paintTile(e.target);
            }
        });

        grid.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        grid.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });

        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('hex-tile')) {
                this.paintTile(e.target);
            }
        });
    }

    paintTile(tile) {
        tile.style.backgroundColor = this.selectedColor;
        tile.style.borderBottomColor = this.selectedColor;
        tile.style.borderTopColor = this.selectedColor;
    }

    clearGrid() {
        const tiles = document.querySelectorAll('.hex-tile');
        tiles.forEach(tile => {
            tile.style.backgroundColor = '#ecf0f1';
            tile.style.borderBottomColor = '#ecf0f1';
            tile.style.borderTopColor = '#ecf0f1';
        });
    }

    setupGridSizeControls() {
        const widthInput = document.getElementById('grid-width');
        const heightInput = document.getElementById('grid-height');
        const resizeBtn = document.getElementById('resize-grid');
        
        widthInput.value = this.gridCols;
        heightInput.value = this.gridRows;
        
        resizeBtn.addEventListener('click', () => {
            this.resizeGrid();
        });
        
        widthInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.resizeGrid();
            }
        });
        
        heightInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.resizeGrid();
            }
        });
    }

    resizeGrid() {
        const widthInput = document.getElementById('grid-width');
        const heightInput = document.getElementById('grid-height');
        
        const newCols = parseInt(widthInput.value);
        const newRows = parseInt(heightInput.value);
        
        if (newCols >= 5 && newCols <= 50 && newRows >= 5 && newRows <= 30) {
            this.gridCols = newCols;
            this.gridRows = newRows;
            this.createGrid();
            this.setupTileInteraction();
        } else {
            alert('Please enter valid dimensions:\nWidth: 5-50 tiles\nHeight: 5-30 tiles');
        }
    }

    generateRandomPattern() {
        const tiles = document.querySelectorAll('.hex-tile');
        const colors = ['#2C3E50', '#8B3A3A', '#F5F5DC', '#CD853F', '#D3D3D3', '#A9A9A9', '#F5DEB3', '#C0C0C0', '#D4A5A5'];
        
        tiles.forEach(tile => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            tile.style.backgroundColor = randomColor;
            tile.style.borderBottomColor = randomColor;
            tile.style.borderTopColor = randomColor;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.floorGenerator = new HydraulicFloorGenerator();
});