Below is a comprehensive software development documentation derived from the conversation and clarifications provided. The goal is to capture **all** relevant details in a well-organized, explanatory format. This document is intended for developers (and stakeholders) who want to understand the architecture, features, and implementation nuances of the **Satisfactory Dashboard** project. It also incorporates Q&A details from the dialogue, ensuring that no information is lost.

---

## 1. Introduction

The **Satisfactory Dashboard** is a React (TypeScript) application designed to help players of the game **Satisfactory** manage and optimize their production chains. It provides a modern, user-friendly, and responsive interface styled with Material-UI (MUI), and it stores/manage data through **Dexie** (indexedDB wrapper).

By supporting both **Tree** and **List** views of production chains, the dashboard allows players to keep track of multiple items, recipes, and machines. It also includes advanced features such as state comparison and byproduct management, making it a versatile tool for mid- to late-game factory design and planning in Satisfactory.

The project maintains version control on a public GitHub repository. A dedicated Markdown file, **dev-tracker.md** (located at the root of the `src` folder), is used to track development goals, tasks, and updates, particularly when using Cursor and AI-based tools like Claude 3.5 Sonnet.

---

## 2. Project Overview

### 2.1 Objectives

1. **Streamline Production Planning**: Provide a dashboard for adding items to be produced, linking them to their recipes, and recursively calculating the required materials, machines, and overall efficiency.  
2. **Manage Multiple Production Chains**: Enable users to create multiple top-level (initial) items, each linking to a network of intermediate and raw materials.  
3. **Visual Appeal & Responsiveness**: Build a modern UI using Material-UI with a sleek, minimal, and user-friendly design. The interface should adapt to various screen sizes.  
4. **Performance & Scalability**: Utilize best practices in React (e.g., memoization, virtualization) and store data via Dexie for offline support and quick lookups.  
5. **Data Accuracy & Extensibility**: All base game items, machines, and recipes are contained within a JSON file in the project. The structure should allow easy addition or modification of data (e.g., new items or recipes).

### 2.2 Technology Stack

- **Front-end**: React (TypeScript), Material-UI (MUI)  
- **Database**: Dexie (for indexedDB)  
- **Version Control**: Public GitHub repository  
- **AI Tools Integration**: Cursor with Claude 3.5 Sonnet for prompt-based development assistance  
- **Icons and Media**: Stored in `public/` (such as `icons.webp`) alongside `data.json`  

---

## 3. Big Picture Features

The Satisfactory Dashboard is built around several core features that enable robust factory planning and tracking:

### 3.1 Production Chain Design

1. **Add Items to Produce**  
   - Users can add any item they wish to produce, selecting the recipe and specifying the production rate (in items per minute).  
   - The system recursively calculates all required inputs for the selected item.  
   - Multiple initial items can be added to form complex production trees.

2. **Change Recipes Dynamically**  
   - If multiple alternative recipes exist for the same item, users can switch between them in a dropdown.  
   - Any change updates the production chain immediately.

3. **Automatic Recursive Calculation**  
   - When a new item is added, its inputs (and their inputs, etc.) are all computed automatically.  
   - If a recipe produces multiple outputs, the secondary outputs are considered **byproducts**.

### 3.2 Production Node Controls

1. **Machine Count and Efficiency**  
   - Each production node displays the machine count and an **efficiency/overclock** value (as a percentage).  
   - By default, the number of machines is set so that efficiency does not exceed 100%.  
   - However, users can adjust the machine count, potentially pushing efficiency above 100%. This visually changes color coding (e.g., red if above 100%, yellow if below 100%, green if exactly 100%).  
   - Clicking or hovering on the efficiency percentage allows the user to copy the decimal value (e.g., 66.67% → 0.666667).

2. **Excess Production Management**  
   - Users can specify additional (“excess”) production rates to indicate if certain machines produce more than needed for the main chain.  
   - This helps track leftover items that can either be stored, sunk, or used in other parts of the chain.

3. **Quick Adjustments**  
   - Include buttons to reset the excess production rate to zero or to automatically set it to ensure exactly 100% efficiency.

### 3.3 State Comparison

1. **Save States (Snapshots)**  
   - Each production chain (often referred to as a “build”) can have multiple saved states.  
   - Users can save a state when they complete or finalize a certain phase.

2. **Compare States**  
   - Users can compare the current state with any saved state to see differences.  
   - Changes such as recipe switches, new items, or machine count adjustments are highlighted.

### 3.4 Production Chain Visualization

1. **Tree View**  
   - Shows parent-child relationships, where each node displays production/consumption rates, item icons, recipe details, machine counts, and overclock.  
   - Collapsible branches allow users to hide unnecessary detail.

2. **List View (Accumulated)**  
   - Consolidates all nodes of the same item+recipe type into one entry.  
   - Allows the user to see a breakdown of where the item is produced, consumed, or stored.  
   - Clicking a consumption entry in the list can auto-scroll to that node’s details.

### 3.5 Byproduct Management

- If a recipe produces extra outputs, those are **byproducts**.  
- Byproducts have negative production rates (indicating they are being produced, not consumed).  
- Byproducts are shown with a distinct visual style (e.g., a reddish tint) and do not allow recipe or machine selection.  
- They only become an active input if the user explicitly decides to use them elsewhere in the chain.

### 3.6 Item and Machine Representation

- **Icons**: Item and machine icons (stored in `public/` and referenced in `data.json`) are used throughout the UI.  
- **Tooltips**: Dropdowns and other UI elements may feature tooltips explaining recipe inputs, outputs, and rates.  
- **Machine Names**: Machine names exclude Mk.X suffixes to keep them generic (e.g., “Miner” instead of “Miner Mk.3”). Instead, a “machine multiplier” field can simulate higher tiers.

### 3.7 Summary and Filtering

- **Summary View**: A toggleable view that displays total production rates, consumption rates, and leftover rates across the entire chain.  
- **Sorting and Filtering**: Users can filter nodes by categories (e.g., raw materials, intermediates, final products) and sort by efficiency, output rate, or machine counts.

### 3.8 Responsive and Modern UI

- **Styling**: All styling uses MUI’s theme system to maintain consistency.  
- **Color & Theme**: A dark theme with consistent color usage (e.g., green, yellow, red for different overclock statuses) is recommended. Any new colors should be added to the theme.  
- **Performance**: Minimize re-renders through memoization. Only re-calculate production rates if the user updates relevant data.

---

## 4. Current Status

### 4.1 Completed Features

1. **Dashboard Layout**  
   - A responsive grid layout for “build cards” shows each production chain.  
   - Build cards display basic details such as current efficiency rates.

2. **Collapsible Sidebar**  
   - The sidebar can be toggled between icon-only (collapsed) and full (expanded).  
   - Smooth animations are in place for expanding/collapsing.

3. **Build Cards**  
   - Build cards have a consistent style and theme.  
   - Users can edit build names through direct input (inline).

4. **Breadcrumb and Titles**  
   - There is a basic breadcrumb (e.g., “Satisfactory > Dashboard”) to help users navigate.  
   - Title hierarchy is present but might require refinement.

### 4.2 Next Steps

1. **Production Chain Editor**  
   - Implement and refine the editor to create and manage production chains.  
   - Add recursive calculations for intermediate and raw materials.

2. **Enhanced Views**  
   - Finalize Tree and List views for production chains.  
   - Integrate icons for items and machines.  
   - Implement collapsibility in Tree view and summary “accumulated” logic in List view.

3. **State Comparison**  
   - Allow saving multiple states/snapshots per build.  
   - Provide a diff or highlight system to compare current vs. saved states.

4. **Advanced Filtering and Summaries**  
   - Improve sorting and filtering (by node efficiency, rate, etc.).  
   - Create a detailed summary view that aggregates all key production data.

---

## 5. Key Q&A Clarifications

During project planning and development, several important questions were raised. Below is a detailed summary of each Q&A, incorporating the clarifications:

### 5.1 Production Rate Logic

1. **Units**:  
   - All production rates are measured in **items per minute**.  

2. **Handling Byproducts**:  
   - When a user explicitly adds an item, any other outputs from that recipe become byproducts.  
   - Byproducts have **negative production rates**, indicating they are being produced (not consumed) passively.  
   - They appear in the chain as tinted nodes with no recipe or machine selection.  
   - However, these byproducts can then be used by other nodes if the user decides to produce another item that consumes them.

3. **Machine Overclock**:  
   - Overclocking is not an input to the system; it is a **calculated result**.  
   - When you specify a rate and number of machines, the system computes the required overclock. If that overclock exceeds 100%, the node is shown in red; if it’s under 100%, it’s yellow; exactly 100% is green.

### 5.2 Data Structure

1. **Separate Rates?**  
   - Whether or not to store pre-computed rates separately from the base quantity data is left open to developer discretion.  
   - The prime directive is to keep memory usage reasonable and computations efficient.  

2. **Power Consumption**:  
   - At this early stage, power usage is **not** tracked. It may be added in a future update or expansion.  

3. **Machine Tier Levels**:  
   - Only a single machine name is used (e.g., “Miner” instead of “Miner Mk.1”).  
   - The tier multiplier (to simulate Mk.2, Mk.3, etc.) should be stored in a “machine multiplier” field.  
   - The suffix “Mk.X” is removed from the UI labels to avoid confusion.  

### 5.3 UI/UX Details

1. **Tree View Node Info**:  
   - Each node displays item name, recipe, production rate, machine count, overclock, and optional leftover (excess) rate.  
   - Power usage is **not** shown at this stage.  

2. **Efficiency/Overclock Color Coding**:  
   - Below 100%: Yellow  
   - Exactly 100%: Green  
   - Above 100%: Red  

3. **Collapsing**:  
   - Individual branches in the Tree view can be collapsed or expanded.  
   - The List view (accumulated) doesn’t have branches, but it references the same underlying data.  

4. **List View Extra Details**:  
   - Each item is grouped (e.g., “Iron Ingots” from multiple recipes are combined).  
   - For each grouped item, the interface shows how much is produced, how much is consumed by various machines, how much is stored, and the net leftover rate.  
   - Clicking a consumption entry auto-scrolls to that node in the chain for convenient reference.

### 5.4 State Management

1. **Separate Context/Hook**:  
   - Moving the production chain logic into a dedicated context or custom hook is encouraged, improving maintainability.  

2. **Undo/Redo Functionality**:  
   - Implementing undo/redo is planned (or at least strongly considered) to help with user experimentation.

### 5.5 Icons and Data Source

1. **Icons**:  
   - The file `ions.webp` (stored in `public/`) contains machine and item icons.  
   - `data.json` references which icon belongs to which item/machine.  

2. **Ensuring Data Accuracy**:  
   - Currently, some machine data might accidentally appear in item dropdowns. This mismatch needs to be corrected so only valid items are shown.  
   - For new color requirements or expansions, add them to the MUI theme.

---

## 6. Additional Implementation Notes

1. **Theme Consistency**  
   - A core principle is to keep a coherent style across the entire dashboard.  
   - All colors, typography choices, and spacing guidelines come from a central MUI theme file.

2. **Naming Conventions**  
   - Machine names should be simplified (remove “Mk.1,” “Mk.2,” etc.).  
   - The internal multiplier for machine tiers should be stored as a numeric value (e.g., 1.5 for Mk.2, 2 for Mk.3).  

3. **Performance Considerations**  
   - React memoization for heavy-lifting components is recommended, especially where large production trees are rendered.  
   - Lazy loading or code splitting can be considered if certain modules (like state comparison or advanced filtering) are large.

4. **File Limit in AI Tools**  
   - When working collaboratively with an AI tool that has a maximum file context, always indicate which files need to be included in the prompt. If more than 10, plan increments.

5. **Review & Suggestions**  
   - At the end of each development iteration, briefly recap what was accomplished, any potential pitfalls discovered, and alternative solutions to explore.

---

## 7. Conclusion

This documentation compiles all critical details of the **Satisfactory Dashboard** project, including the original feature breakdown, clarifications from Q&A, and development steps to come. It emphasizes consistent **UI/UX**, efficient **production chain calculations**, and thorough **state management**. 

As development progresses, the **dev-tracker.md** file will remain the living document of record, capturing incremental changes, tasks, and improvements. By keeping the design modular, the code well-organized, and the user experience at the forefront, the team can ensure that this dashboard delivers a best-in-class tool for Satisfactory players. 

**End of Document**