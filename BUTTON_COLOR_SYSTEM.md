# Button Color System - Unified Design

## 🎨 **Color Palette**

| Color | Hex Code | Usage | Description |
|-------|----------|-------|-------------|
| **Primary** | `#8C7E9C` | Main actions | Save, Update, Create, Submit, Test |
| **Secondary** | `#553C9A` | Secondary actions | Edit, View, Navigate, Cancel |
| **Delete** | `#C24C4C` | Destructive actions | Delete, Remove, Clear |

## 🔄 **Hover States**

| Base Color | Hover Color | Hex Code |
|------------|-------------|----------|
| Primary (`#8C7E9C`) | Darker | `#7A6B8A` |
| Secondary (`#553C9A`) | Darker | `#4A2F8A` |
| Delete (`#C24C4C`) | Darker | `#7A3636` |

## 📱 **Button Types & Usage**

### **Primary Buttons** (`#8C7E9C`)
- ✅ **Save/Update** - Form submissions
- ✅ **Create/Add** - New item creation
- ✅ **Submit** - Action confirmations
- ✅ **Test** - AI testing functionality

### **Secondary Buttons** (`#553C9A`)
- 🔧 **Edit** - Switch to edit mode
- 👁️ **View** - Navigate to detail pages
- 🔄 **Cancel** - Cancel operations
- 📍 **Navigation** - Breadcrumb links

### **Delete Buttons** (`#C24C4C`)
- 🗑️ **Delete** - Remove items
- 🚫 **Remove** - Clear selections
- ⚠️ **Danger** - Destructive actions

## 🎯 **Implementation Examples**

### **Primary Button**
```tsx
<button className="bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
  Save Changes
</button>
```

### **Secondary Button**
```tsx
<button className="bg-[#553C9A] hover:bg-[#4A2F8A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
  Edit
</button>
```

### **Delete Button**
```tsx
<button className="bg-[#C24C4C] hover:bg-[#7A3636] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
  Delete
</button>
```

### **Outline Button**
```tsx
<button className="border border-[#553C9A] text-[#553C9A] bg-white hover:bg-[#553C9A] hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
  Cancel
</button>
```

## 🚀 **Benefits**

- ✅ **Consistent UX** - Same colors across all pages
- ✅ **Professional Look** - Cohesive design system
- ✅ **Clear Hierarchy** - Users understand button importance
- ✅ **Accessibility** - Proper contrast ratios
- ✅ **Maintainability** - Easy to update globally

## 📋 **Pages Updated**

- ✅ **AI Detail Page** - All buttons unified
- ✅ **AI List Page** - Create button updated
- ✅ **Audio Detail Page** - Edit/Delete buttons unified
- ✅ **Audio List Page** - Upload/Bulk delete buttons unified
- ✅ **DeleteConfirmModal** - Delete button unified
- ✅ **User Detail Page** - Already using consistent colors

## 🔧 **Future Updates**

When adding new buttons, use these color codes:
- **Primary actions**: `bg-[#8C7E9C] hover:bg-[#7A6B8A]`
- **Secondary actions**: `bg-[#553C9A] hover:bg-[#4A2F8A]`
- **Delete actions**: `bg-[#C24C4C] hover:bg-[#7A3636]`

## 📚 **Utility File**

Created `src/utils/buttonStyles.ts` for future use:
```tsx
export const buttonStyles = {
  primary: `bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white`,
  secondary: `bg-[#553C9A] hover:bg-[#4A2F8A] text-white`,
  delete: `bg-[#C24C4C] hover:bg-[#7A3636] text-white`,
  // ... more styles
};
```
