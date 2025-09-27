# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple text-based game catalog repository containing two main files:
- `xbox-games.txt`: A comprehensive list of Xbox games with region codes (984 games total)
- `homebrew.txt`: A list of homebrew games and applications for Xbox (56 entries total)

## Architecture & Structure

This repository contains plain text files organized as game catalogs:

**xbox-games.txt format:**
- Line-numbered entries (1-984)
- Format: `LINE_NUMBER→GAME_TITLE,REGION_CODE`
- Region codes: USA, PAL, JPN, GLO (Global)
- Games span multiple genres and years

**homebrew.txt format:**
- Line-numbered entries (1-57)
- Format: `LINE_NUMBER→HOMEBREW_TITLE [VERSION]`
- Includes ports, original games, and emulators

## Working with Game Lists

When modifying these files:
1. Maintain the line-numbered format with `→` separator
2. For xbox-games.txt, include region codes after the comma
3. For homebrew.txt, include version numbers where applicable
4. Keep entries alphabetically organized where possible
5. Preserve the existing numbering scheme

## Common Tasks

Since this is a data repository, typical operations include:
- Searching for specific games by title or region
- Adding new game entries
- Updating existing entries
- Sorting or reorganizing lists
- Converting between formats (if needed)

## Data Integrity

- Verify game titles are accurate
- Ensure region codes are valid (USA, PAL, JPN, GLO)
- Maintain consistent formatting across entries
- Check for duplicate entries when adding new games