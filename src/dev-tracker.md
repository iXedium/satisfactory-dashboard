# **Satisfactory Dashboard Development Tracker**

## **Rules**

1. **Project Standards**:
   - Use React (TypeScript), Vite, Material-UI (MUI), and Dexie as the core technologies.
   - Maintain a sleek, user-friendly, and modern UI that adheres to high standards in usability, styling, and performance.
   - Follow strict coding practices and design patterns for scalability and maintainability.

2. **Workflow**:
   - Always read this **Dev Tracker** file before executing tasks and update it after completing tasks.

3. **Styling**:
   - Strictly use colors and styles defined in the MUI theme.
   - Avoid hardcoded values; add missing colors to the theme and use them from there.
   - Follow a dark theme with a clean, consistent, and minimal aesthetic.

4. **Data Management**:
   - Use the JSON file directly as the data source.
   - Handle data operations with Dexie for efficiency and flexibility.

5. **Feature Development**:
   - Ensure the implementation of all features aligns with the project's goals and adheres to best practices.
   - Implement smooth animations for transitions and interactions when applicable.
   - Prioritize responsiveness and performance, utilizing techniques like memoization and virtualization.

6. **Collaboration**:
   - Provide detailed feedback and context when completted a task.

7. **Testing**:
   - Include testing as part of the development process to ensure functionality and performance.
   - Focus on both unit testing and user experience testing.

---

## **Goals**
- Create a modern, responsive, and user-friendly dashboard for managing production chains in the game **Satisfactory**.
- Enable users to visualize, design, and track production chains effectively.
- Ensure scalability and performance while adhering to high standards in design and development.

---

# Development Tracker

## Current Status (Updated: [current-date])

### Completed
- Basic application structure
- Database setup with Dexie
- Theme context and styling foundation
- Production planner page with basic tree view
- Production node component with basic controls
- TypeScript interfaces for items, recipes, and production nodes
- Production chain context with rate calculations
- Basic production node component with efficiency display

### In Progress
- Enhanced production node functionality
  - [x] Basic node structure
  - [x] Tree view implementation
  - [x] Icon support for items and machines
  - [x] Machine multiplier display
  - [x] Rate calculations
  - [x] Machine efficiency display
  - [ ] Byproduct handling
  - [ ] Excess production controls
  - [ ] Recipe selection UI

### Technical Updates
- Added comprehensive TypeScript interfaces for items, recipes, and production nodes
- Implemented production chain context with recursive rate calculations
- Created reusable ProductionNode component with collapsible tree view
- Added efficiency color coding (red > 100%, yellow < 100%, green = 100%)
- Implemented automatic machine count calculation based on target rates

### Next Steps
1. Production Chain Logic
   - [x] Implement rate calculations considering machine multipliers
   - [x] Add machine efficiency calculations
   - [ ] Complete byproduct handling system
   - [ ] Implement excess production tracking
   - [ ] Add recipe selection UI

2. UI Enhancements
   - [x] Add color-coded efficiency display
   - [ ] Implement clipboard copy for efficiency values
   - [ ] Add byproduct visual styling
   - [ ] Enhance node controls UI
   - [ ] Add loading states and error handling

3. View Modes
   - [x] Basic tree view functionality
   - [ ] Complete tree view with all features
   - [ ] Implement list (accumulated) view
   - [ ] Create unified node component for both views

### Technical Notes
- All rates are calculated in items/minute
- Byproducts use negative rates for production
- Machine overclock is calculated, not input
- Node component should be flexible for both view modes
- Theme should be used for all styling decisions

### Questions/Concerns
- Consider implementing undo/redo functionality
- Evaluate performance optimization needs
- Plan for future power consumption tracking

---

## **Future Tasks**
1. Add advanced controls for production nodes (e.g., machine count, efficiency, excess production).
2. Implement list view as an alternative to the tree view for production chains.
3. Add saving and comparing states of production setups.
4. Introduce sorting and filtering options for nodes.
5. Optimize performance for large and complex production chains.
6. Add animations for transitions and interactions.

---

### **Notes**
- Always refer to this file before starting a new task.
- Update this file with completed tasks, new goals, and any relevant notes after each development session.
- The Production Planner now supports:
  - Item selection from game data with category grouping
  - Recipe selection with input/output details
  - Dynamic dependency calculation based on production rates
  - Node editing and deletion
  - Collapsible tree structure for better organization
