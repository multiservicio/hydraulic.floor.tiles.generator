ALGORITHM: RandomHexagonalFloorGenerator

// Configuration Constants
DEFINE tile_colors = [
    {color: "#2C3E50", name: "navy", weight: 5},      // Rare accent
    {color: "#8B3A3A", name: "burgundy", weight: 15}, // Medium frequency
    {color: "#F5F5DC", name: "cream", weight: 25},    // High frequency
    {color: "#CD853F", name: "terracotta", weight: 12}, // Medium frequency
    {color: "#D3D3D3", name: "light_gray", weight: 20}, // High frequency
    {color: "#A9A9A9", name: "medium_gray", weight: 18}, // High frequency
    {color: "#F5DEB3", name: "beige", weight: 15},    // Medium frequency
    {color: "#C0C0C0", name: "warm_gray", weight: 10}, // Low-medium frequency
    {color: "#D4A5A5", name: "dusty_rose", weight: 8}  // Low frequency
]

DEFINE cluster_probability = 0.3  // 30% chance for clustering
DEFINE cluster_size_range = [2, 5]  // Cluster contains 2-5 tiles
DEFINE variation_intensity = 0.15   // 15% color variation for weathering

// Main Algorithm
FUNCTION generateHexFloor(grid_width, grid_height):
    // Step 1: Initialize grid
    grid = CREATE_2D_ARRAY(grid_width, grid_height)
    color_map = CREATE_2D_ARRAY(grid_width, grid_height)
    
    // Step 2: Generate hexagonal coordinate system
    hex_coordinates = generateHexCoordinates(grid_width, grid_height)
    
    // Step 3: Place accent colors first (navy blue clusters)
    FOR each navy_cluster in range(1, 3):
        seed_position = getRandomHexPosition(hex_coordinates)
        cluster_size = random(2, 4)
        plantCluster(seed_position, "navy", cluster_size, hex_coordinates, color_map)
    END FOR
    
    // Step 4: Place medium-frequency color clusters
    FOR each color in ["burgundy", "terracotta"]:
        cluster_count = random(3, 6)
        FOR i in range(cluster_count):
            IF random() < cluster_probability:
                seed_position = getRandomEmptyPosition(hex_coordinates, color_map)
                IF seed_position != null:
                    cluster_size = random(cluster_size_range[0], cluster_size_range[1])
                    plantCluster(seed_position, color, cluster_size, hex_coordinates, color_map)
                END IF
            END IF
        END FOR
    END FOR
    
    // Step 5: Fill remaining positions with weighted random selection
    FOR each position in hex_coordinates:
        IF color_map[position] == empty:
            // Check neighboring colors for influence
            neighbor_colors = getNeighborColors(position, color_map, hex_coordinates)
            
            // Apply neighbor influence (avoid too much clustering of same colors)
            influenced_weights = adjustWeightsByNeighbors(tile_colors, neighbor_colors)
            
            // Select color based on weighted probability
            selected_color = weightedRandomSelect(influenced_weights)
            color_map[position] = selected_color
        END IF
    END FOR
    
    // Step 6: Apply weathering and variations
    FOR each position in hex_coordinates:
        base_color = color_map[position]
        weathered_color = applyWeathering(base_color, variation_intensity)
        color_map[position] = weathered_color
    END FOR
    
    RETURN color_map, hex_coordinates
END FUNCTION

// Helper Functions
FUNCTION generateHexCoordinates(width, height):
    coordinates = []
    FOR row in range(height):
        FOR col in range(width):
            // Convert to axial coordinates for hexagonal grid
            q = col - floor(row/2)
            r = row
            coordinates.append({q: q, r: r, x: col, y: row})
        END FOR
    END FOR
    RETURN coordinates
END FUNCTION

FUNCTION plantCluster(seed_position, color, size, hex_coords, color_map):
    cluster = [seed_position]
    color_map[seed_position] = color
    
    WHILE cluster.length < size:
        current_tile = random_choice(cluster)
        neighbors = getEmptyNeighbors(current_tile, hex_coords, color_map)
        
        IF neighbors.length > 0:
            new_tile = random_choice(neighbors)
            color_map[new_tile] = color
            cluster.append(new_tile)
        ELSE:
            BREAK  // No more empty neighbors
        END IF
    END WHILE
END FUNCTION

FUNCTION getNeighbors(position, hex_coordinates):
    // Get 6 adjacent hexagonal neighbors using axial coordinates
    neighbor_offsets = [
        {q: +1, r: 0}, {q: +1, r: -1}, {q: 0, r: -1},
        {q: -1, r: 0}, {q: -1, r: +1}, {q: 0, r: +1}
    ]
    
    neighbors = []
    FOR each offset in neighbor_offsets:
        neighbor_q = position.q + offset.q
        neighbor_r = position.r + offset.r
        
        IF isValidPosition(neighbor_q, neighbor_r, hex_coordinates):
            neighbors.append(getPositionByAxial(neighbor_q, neighbor_r, hex_coordinates))
        END IF
    END FOR
    
    RETURN neighbors
END FUNCTION

FUNCTION adjustWeightsByNeighbors(base_weights, neighbor_colors):
    adjusted_weights = copy(base_weights)
    
    FOR each neighbor_color in neighbor_colors:
        FOR each weight_entry in adjusted_weights:
            IF weight_entry.color == neighbor_color:
                // Reduce probability of same color (prevent over-clustering)
                weight_entry.weight *= 0.7
            ELSE IF isComplementaryColor(weight_entry.color, neighbor_color):
                // Increase probability of complementary colors
                weight_entry.weight *= 1.2
            END IF
        END FOR
    END FOR
    
    RETURN adjusted_weights
END FUNCTION

FUNCTION weightedRandomSelect(weighted_options):
    total_weight = sum(option.weight for option in weighted_options)
    random_value = random() * total_weight
    
    cumulative_weight = 0
    FOR each option in weighted_options:
        cumulative_weight += option.weight
        IF random_value <= cumulative_weight:
            RETURN option.color
        END IF
    END FOR
    
    RETURN weighted_options[0].color  // Fallback
END FUNCTION

FUNCTION applyWeathering(base_color, intensity):
    // Convert hex to RGB
    rgb = hexToRgb(base_color)
    
    // Apply random variations to each channel
    FOR each channel in [r, g, b]:
        variation = random(-intensity, intensity)
        rgb[channel] = clamp(rgb[channel] * (1 + variation), 0, 255)
    END FOR
    
    // Convert back to hex
    RETURN rgbToHex(rgb)
END FUNCTION

// Usage
floor_design = generateHexFloor(20, 15)  // 20x15 hexagonal grid
