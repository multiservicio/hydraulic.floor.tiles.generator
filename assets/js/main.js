const PALETTE = [
    {
        id: 'navy',
        hex: '#2C3E50',
        name: 'Navy',
        weight: 5,
        cluster: {
            role: 'accent',
            maxCount: 2,
            tilesPerCluster: 20,
            minSize: 2,
            maxSize: 4,
            spawnChance: 1,
        },
        complements: ['cream'],
    },
    {
        id: 'burgundy',
        hex: '#8B3A3A',
        name: 'Burgundy',
        weight: 15,
        cluster: {
            role: 'medium',
            minCount: 2,
            maxCount: 5,
            minSize: 2,
            maxSize: 5,
            spawnChance: 0.3,
        },
        complements: ['light_gray'],
    },
    {
        id: 'cream',
        hex: '#F5F5DC',
        name: 'Cream',
        weight: 25,
        complements: ['navy'],
    },
    {
        id: 'terracotta',
        hex: '#CD853F',
        name: 'Terracotta',
        weight: 12,
        cluster: {
            role: 'medium',
            minCount: 2,
            maxCount: 5,
            minSize: 2,
            maxSize: 5,
            spawnChance: 0.3,
        },
        complements: ['warm_gray'],
    },
    {
        id: 'light_gray',
        hex: '#D3D3D3',
        name: 'Light Gray',
        weight: 20,
        complements: ['burgundy'],
    },
    {
        id: 'medium_gray',
        hex: '#A9A9A9',
        name: 'Medium Gray',
        weight: 18,
    },
    {
        id: 'beige',
        hex: '#F5DEB3',
        name: 'Beige',
        weight: 15,
    },
    {
        id: 'warm_gray',
        hex: '#C0C0C0',
        name: 'Warm Gray',
        weight: 10,
        complements: ['terracotta'],
    },
    {
        id: 'dusty_rose',
        hex: '#D4A5A5',
        name: 'Dusty Rose',
        weight: 8,
    },
];

class HydraulicFloorGenerator {
    constructor() {
        this.palette = PALETTE;
        this.paletteLookup = this.palette.reduce((acc, color) => {
            acc[color.hex.toUpperCase()] = color;
            return acc;
        }, {});
        this.baseWeights = this.palette.map((color) => ({
            color: color.hex,
            id: color.id,
            weight: color.weight,
        }));
        this.selectedColor = this.palette[0]?.hex || '#2C3E50';
        this.gridRows = 20;
        this.gridCols = 20;
        this.colorNames = this.palette.reduce((acc, color) => {
            acc[color.hex.toUpperCase()] = color.name;
            return acc;
        }, {});
        this.init();
    }

    init() {
        this.createGrid();
        this.setupColorPalette();
        this.setupTileInteraction();
        this.setupGridSizeControls();
        this.setupAutoFill();
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

        // Update summary after creating new grid
        this.updateColorSummary();
    }

    setupColorPalette() {
        const colorOptions = document.querySelectorAll('.color-item');

        colorOptions[0].classList.add('selected');
        this.selectedColor = colorOptions[0].dataset.color;

        colorOptions.forEach((option) => {
            option.addEventListener('click', () => {
                colorOptions.forEach((opt) => opt.classList.remove('selected'));
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

    // Paint a tile with a given color; defaults to the currently selected color.
    paintTile(tile, color = this.selectedColor) {
        tile.style.backgroundColor = color;
        tile.style.borderBottomColor = color;
        tile.style.borderTopColor = color;
        // Keep summary in sync when painting interactively or programmatically
        this.updateColorSummary();
    }

    // Clear the grid and refresh the summary
    clearGrid() {
        const tiles = document.querySelectorAll('.hex-tile');
        tiles.forEach((tile) => {
            tile.style.backgroundColor = '#ecf0f1';
            tile.style.borderBottomColor = '#ecf0f1';
            tile.style.borderTopColor = '#ecf0f1';
        });
        this.updateColorSummary();
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

    setupAutoFill() {
        const autoFillBtn = document.getElementById('auto-fill');
        autoFillBtn.addEventListener('click', () => {
            this.generateBeautifulDesign();
        });
    }

    generateBeautifulDesign() {
        const tiles = document.querySelectorAll('.hex-tile');
        const colorMap = new Map();
        const hexCoordinates = this.generateHexCoordinates();
        const baseWeights = this.baseWeights;

        // Step 1: Place accent color clusters
        this.placeAccentClusters(hexCoordinates, colorMap);

        // Step 2: Place medium-frequency color clusters
        this.placeMediumClusters(hexCoordinates, colorMap);

        // Step 3: Fill remaining positions with weighted selection
        this.fillRemainingPositions(hexCoordinates, colorMap, baseWeights);

        // Step 4: Apply colors to tiles
        tiles.forEach((tile) => {
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            const key = `${row}-${col}`;
            const baseColor = colorMap.get(key) || this.weightedRandomSelect(baseWeights);
            this.paintTile(tile, baseColor);
        });
    }

    generateHexCoordinates() {
        const coordinates = [];
        for (let row = 0; row < this.gridRows; row++) {
            for (let col = 0; col < this.gridCols; col++) {
                const q = col - Math.floor(row / 2);
                const r = row;
                coordinates.push({ q, r, x: col, y: row, key: `${row}-${col}` });
            }
        }
        return coordinates;
    }

    placeAccentClusters(hexCoordinates, colorMap) {
        const accentColors = this.palette.filter(
            (color) => color.cluster && color.cluster.role === 'accent'
        );

        accentColors.forEach((accent) => {
            const { cluster } = accent;
            const tilesPerCluster = cluster.tilesPerCluster || 20;
            const clusterBudget = Math.min(
                cluster.maxCount,
                Math.floor(hexCoordinates.length / tilesPerCluster)
            );

            for (let i = 0; i < clusterBudget; i++) {
                const seedPosition = this.getRandomPosition(hexCoordinates, colorMap);
                if (seedPosition) {
                    const clusterSize = this.getRandomInt(cluster.minSize, cluster.maxSize);
                    this.plantCluster(
                        seedPosition,
                        accent.hex,
                        clusterSize,
                        hexCoordinates,
                        colorMap
                    );
                }
            }
        });
    }

    placeMediumClusters(hexCoordinates, colorMap) {
        const mediumColors = this.palette.filter(
            (color) => color.cluster && color.cluster.role === 'medium'
        );

        mediumColors.forEach((color) => {
            const { cluster } = color;
            const clusterCount = this.getRandomInt(cluster.minCount, cluster.maxCount);
            for (let i = 0; i < clusterCount; i++) {
                if (Math.random() < (cluster.spawnChance || 1)) {
                    const seedPosition = this.getRandomPosition(hexCoordinates, colorMap);
                    if (seedPosition) {
                        const clusterSize = this.getRandomInt(cluster.minSize, cluster.maxSize);
                        this.plantCluster(
                            seedPosition,
                            color.hex,
                            clusterSize,
                            hexCoordinates,
                            colorMap
                        );
                    }
                }
            }
        });
    }

    fillRemainingPositions(hexCoordinates, colorMap, baseWeights) {
        hexCoordinates.forEach((position) => {
            if (!colorMap.has(position.key)) {
                const neighborColors = this.getNeighborColors(position, colorMap, hexCoordinates);
                const adjustedWeights = this.adjustWeightsByNeighbors(baseWeights, neighborColors);
                const selectedColor = this.weightedRandomSelect(adjustedWeights);
                colorMap.set(position.key, selectedColor);
            }
        });
    }

    plantCluster(seedPosition, color, size, hexCoordinates, colorMap) {
        const cluster = [seedPosition];
        colorMap.set(seedPosition.key, color);

        while (cluster.length < size) {
            const currentTile = cluster[Math.floor(Math.random() * cluster.length)];
            const neighbors = this.getEmptyNeighbors(currentTile, hexCoordinates, colorMap);

            if (neighbors.length > 0) {
                const newTile = neighbors[Math.floor(Math.random() * neighbors.length)];
                colorMap.set(newTile.key, color);
                cluster.push(newTile);
            } else {
                break;
            }
        }
    }

    getRandomPosition(hexCoordinates, colorMap) {
        const emptyPositions = hexCoordinates.filter((pos) => !colorMap.has(pos.key));
        return emptyPositions.length > 0
            ? emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
            : null;
    }

    getNeighbors(position, hexCoordinates) {
        const neighborOffsets = [
            { q: +1, r: 0 },
            { q: +1, r: -1 },
            { q: 0, r: -1 },
            { q: -1, r: 0 },
            { q: -1, r: +1 },
            { q: 0, r: +1 },
        ];

        const neighbors = [];
        neighborOffsets.forEach((offset) => {
            const neighborQ = position.q + offset.q;
            const neighborR = position.r + offset.r;

            const neighbor = hexCoordinates.find(
                (coord) => coord.q === neighborQ && coord.r === neighborR
            );
            if (neighbor) {
                neighbors.push(neighbor);
            }
        });

        return neighbors;
    }

    getEmptyNeighbors(position, hexCoordinates, colorMap) {
        return this.getNeighbors(position, hexCoordinates).filter(
            (neighbor) => !colorMap.has(neighbor.key)
        );
    }

    getNeighborColors(position, colorMap, hexCoordinates) {
        const neighbors = this.getNeighbors(position, hexCoordinates);
        return neighbors
            .map((neighbor) => colorMap.get(neighbor.key))
            .filter((color) => color !== undefined);
    }

    getRandomInt(min, max) {
        const lower = Math.ceil(min);
        const upper = Math.floor(max);
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }

    adjustWeightsByNeighbors(baseWeights, neighborColors) {
        const adjusted = baseWeights.map((w) => ({ ...w }));

        neighborColors.forEach((neighborColor) => {
            adjusted.forEach((weight) => {
                if (weight.color === neighborColor) {
                    weight.weight *= 0.7; // Reduce same color probability
                } else if (this.isComplementaryColor(weight.color, neighborColor)) {
                    weight.weight *= 1.2; // Increase complementary colors
                }
            });
        });

        return adjusted;
    }

    isComplementaryColor(color1, color2) {
        const first = this.paletteLookup[color1.toUpperCase()];
        const second = this.paletteLookup[color2.toUpperCase()];

        if (!first || !second || !first.complements || first.complements.length === 0) {
            return false;
        }

        return first.complements.some((complementId) => complementId === second.id);
    }

    weightedRandomSelect(weightedOptions) {
        const totalWeight = weightedOptions.reduce((sum, option) => sum + option.weight, 0);
        const randomValue = Math.random() * totalWeight;

        let cumulativeWeight = 0;
        for (const option of weightedOptions) {
            cumulativeWeight += option.weight;
            if (randomValue <= cumulativeWeight) {
                return option.color;
            }
        }

        return weightedOptions[0].color;
    }

    updateColorSummary() {
        const tiles = document.querySelectorAll('.hex-tile');
        const colorCounts = {};
        const defaultColor = 'rgb(236, 240, 241)'; // #ecf0f1 in RGB

        // Count colors from all tiles
        tiles.forEach((tile) => {
            const bgColor = tile.style.backgroundColor;
            if (bgColor && bgColor !== defaultColor) {
                // Convert RGB to hex for consistency
                const hexColor = this.rgbToHex(bgColor);
                colorCounts[hexColor] = (colorCounts[hexColor] || 0) + 1;
            }
        });

        this.renderColorSummary(colorCounts);
    }

    renderColorSummary(colorCounts) {
        const summaryContainer = document.getElementById('color-summary');
        const summaryCard = summaryContainer.closest('.color-summary-card');

        if (Object.keys(colorCounts).length === 0) {
            summaryContainer.innerHTML = '';
            if (summaryCard) {
                summaryCard.classList.add('is-hidden');
            }
            return;
        }
        if (summaryCard) {
            summaryCard.classList.remove('is-hidden');
        }

        // Sort by count (descending) then by color name
        const sortedColors = Object.entries(colorCounts).sort(
            (a, b) =>
                b[1] - a[1] ||
                (this.colorNames[a[0]] || '').localeCompare(this.colorNames[b[0]] || '')
        );

        const summaryItems = sortedColors
            .map(([color, count]) => {
                const colorName = this.colorNames[color] || 'Unknown';
                return `
                <div class="color-count-item">
                    <div class="color-count-swatch" style="background-color: ${color};"></div>
                    <span class="color-count-text">${colorName}: ${count} tile${count !== 1 ? 's' : ''}</span>
                </div>
            `;
            })
            .join('');

        summaryContainer.innerHTML = summaryItems;
    }

    rgbToHex(rgb) {
        // Handle already hex colors
        if (rgb.startsWith('#')) return rgb.toUpperCase();

        // Parse RGB string like "rgb(44, 62, 80)"
        const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!rgbMatch) return rgb;

        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);

        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    generateRandomPattern() {
        const tiles = document.querySelectorAll('.hex-tile');
        const colors = this.palette.map((color) => color.hex);

        tiles.forEach((tile) => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.paintTile(tile, randomColor);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.floorGenerator = new HydraulicFloorGenerator();
});
