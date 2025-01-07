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

## **Current Tasks**

### **Production Planner**
#### Overview:
The Production Planner is a dedicated page linked from the dashboard's build cards. It allows users to:
1. Add initial items to produce, select recipes, and set production rates.
2. Dynamically calculate and display dependencies in a tree structure.

#### Tasks:
1. ✅ **Planner Page Setup**:
   - ✅ Create a new route (`/planner`) and link it to the build cards.
   - ✅ Build the basic layout with two sections:
     - ✅ A collapsible panel for adding initial items.
     - ✅ A main area for displaying the production chain tree.

2. ✅ **Collapsible Section for Initial Items**:
   - ✅ Create a form to input:
     - ✅ Item to produce.
     - ✅ Recipe selection.
     - ✅ Desired production rate.
   - ✅ Add a toggle to collapse/expand this section.

3. ✅ **Production Chain Tree List**:
   - ✅ Use Material-UI's TreeView and TreeItem from @mui/lab for displaying the production chain.
   - ✅ Add nodes for items, recipes, and rates.
   - ✅ Ensure dependencies update dynamically based on user input.

4. ✅ **Styling and Integration**:
   - ✅ Adhere to the current dark theme and styling rules.
   - ✅ Use MUI's grid and system properties (`sx`) for layout and spacing.

5. ✅ **Item and Recipe Integration**:
   - ✅ Add item selection from game data.
   - ✅ Add recipe selection from game data.
   - ✅ Implement dependency calculation.
   - ✅ Add node editing and deletion.

6. **Next Steps**:
   - Add node reordering.
   - Add machine count and efficiency calculations.
   - Add excess production tracking.
   - Implement saving and loading builds.

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
