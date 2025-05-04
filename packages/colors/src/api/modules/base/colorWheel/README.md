# `@toolbox-ts/colors/ColorWheel`

Utility for working with the color wheel, dividing it into six 60° sectors:

1. red–yellow
2. yellow–green
3. green–cyan
4. cyan–blue
5. blue–magenta
6. magenta–red

- **Exports**
  - **ColorWheel:** ES6 module
    - **Sector:** Union type of the six color wheel sectors.
    - **angles:** { min: 0, max: 360, sector: 60 } constants for wheel math.
    - **sectors:** Object mapping each sector to its start and end angles.
    - **isIn**:
      - **.circle(value):** Returns true if value is a number between 0–360.
      - **.sector(position, target):** Returns true if position (angle) is
        within the specified sector.
