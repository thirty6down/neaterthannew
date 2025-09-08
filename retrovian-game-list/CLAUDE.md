# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a retro gaming database project containing a comprehensive catalog of 2,695 games across 40+ gaming platforms in CSV format. The project is focused on data management for Batocera (retro gaming distribution) rather than traditional software development.

## File Structure

- `Retrovian Game List 1.0 - batocera_games.csv` - Main game database (188KB)
  - Contains game metadata: Name, System, Developer, Publisher, Genre, Rating
  - Rating scale: 0.0-1.0 numerical values
  - Covers platforms from arcade systems (FBNEO, NEOGEO) to home consoles (SNES, NES, PlayStation)

## Common Data Operations

Since this is a data-centric project, common operations include:

**Data Analysis:**
```bash
# Count total games
wc -l "Retrovian Game List 1.0 - batocera_games.csv"

# View file structure
head -5 "Retrovian Game List 1.0 - batocera_games.csv"

# Count games by platform
cut -d',' -f2 "Retrovian Game List 1.0 - batocera_games.csv" | sort | uniq -c | sort -nr
```

**Data Validation:**
- Check for duplicate entries by Name+System combination
- Validate rating values are within 0.0-1.0 range
- Ensure required fields (Name, System) are populated
- Verify CSV format integrity

## Architecture Notes

- **Single-file data project** - No build system or dependencies
- **CSV-based storage** - Direct file manipulation and analysis
- **Gaming platform focus** - Data tailored for retro gaming emulation systems
- **Batocera integration** - Formatted for import into Batocera gaming distribution

## Data Schema

The CSV follows this structure:
1. Name (required) - Game title
2. System (required) - Gaming platform identifier
3. Developer - Game developer
4. Publisher - Game publisher
5. Genre - Game category
6. Rating - Numerical rating (0.0-1.0)
7. Column 1 - Empty (reserved)
8. Column 2 - Empty (reserved)

## Platform Identifiers

Key gaming systems in the database:
- `FBNEO` - FinalBurn Neo arcade emulator (553 games)
- `ZXSPECTRUM` - ZX Spectrum computer (312 games)
- `COLECOVISION` - ColecoVision console (140 games)
- `NEOGEO` - Neo Geo arcade system (136 games)
- `SNES` - Super Nintendo Entertainment System (116 games)
- Plus 35+ additional retro gaming platforms

## Working with the Data

When modifying the CSV:
- Maintain header row structure
- Preserve comma-separated format
- Keep rating values between 0.0-1.0
- Use consistent platform identifiers
- Ensure no trailing commas or malformed rows