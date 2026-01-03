---
description: 'ReactJS development standards and best practices'
applyTo: '**/*.jsx, **/*.tsx, **/*.js, **/*.ts, **/*.css, **/*.scss'
---

# ReactJS Development Instructions

Instructions for building high-quality ReactJS applications with modern patterns, hooks, and best practices following the official React documentation at https://react.dev.

## Project Context
- Latest React version (React 19+)
- TypeScript for type safety (when applicable)
- Functional components with hooks as default
- Follow React's official style guide and best practices
- Use modern build tools (Vite, Create React App, or custom Webpack setup)
- MUST use proper shadcn/ui component composition and reusability patterns

## Development Standards

### UI Components (shadcn/ui)
**PRIORITY RULE: Always use shadcn/ui components first**
- **Use the local shadcn/ui MCP tools** to search and explore available components
- Search [shadcn/ui documentation](https://ui.shadcn.com) for appropriate components before creating custom ones
- **DO NOT create new UI components** if shadcn/ui provides a suitable alternative
- Use component composition to combine shadcn/ui components for complex UI patterns
- Only create custom components when shadcn/ui genuinely doesn't have a matching component

#### Using shadcn/ui MCP Tools
This project has shadcn/ui MCP (Model Context Protocol) tools available:
- Use MCP tools to **search for components** by name or description
- Use MCP tools to **view component details** including props, usage examples, and demos
- Use MCP tools to **get installation commands** for specific components
- Use MCP tools to **find usage examples** and implementation patterns

**Workflow:**
1. Search for components using MCP tools based on UI requirements
2. Review component details, props, and examples
3. Get the add command and install the component
4. View demo code for implementation guidance
5. Implement using the component with proper TypeScript types

#### Common shadcn/ui Components to Use
- **Buttons & Actions**: `Button`, `Toggle`, `ToggleGroup`
- **Forms & Inputs**: `Input`, `Label`, `Form`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`
- **Layout**: `Card`, `Sheet`, `Separator`, `ScrollArea`, `AspectRatio`
- **Overlays**: `Dialog`, `AlertDialog`, `Popover`, `DropdownMenu`, `ContextMenu`, `HoverCard`, `Tooltip`
- **Data Display**: `Table`, `Badge`, `Avatar`, `Calendar`, `Tabs`, `Accordion`
- **Feedback**: `Alert`, `Toast`, `Progress`, `Skeleton`
- **Navigation**: `NavigationMenu`, `Menubar`, `Command`

#### Installation & Usage
```bash
# Install a component when needed
npx shadcn@latest add [component-name]
```

```tsx
// Example: Use shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
```

### Architecture
- Use functional components with hooks as the primary pattern
- Implement component composition over inheritance
- Organize components by feature or domain for scalability
- Separate presentational and container components clearly
- Use custom hooks for reusable stateful logic
- Implement proper component hierarchies with clear data flow

### TypeScript Integration
- Use TypeScript interfaces for props, state, and component definitions
- Define proper types for event handlers and refs
- Implement generic components where appropriate
- Use strict mode in `tsconfig.json` for type safety
- Leverage React's built-in types (`React.FC`, `React.ComponentProps`, etc.)
- Create union types for component variants and states

### Component Design
- **Use shadcn/ui components as building blocks** - avoid reinventing UI patterns
- Follow the single responsibility principle for components
- Use descriptive and consistent naming conventions
- Implement proper prop validation with TypeScript or PropTypes
- Design components to be testable and reusable
- Keep components small and focused on a single concern
- Use composition patterns (render props, children as functions)
- Extend shadcn/ui components with additional props/variants when needed

### State Management
- Use `useState` for local component state
- Implement `useReducer` for complex state logic
- Leverage `useContext` for sharing state across component trees
- Consider external state management (Redux Toolkit, Zustand) for complex applications
- Implement proper state normalization and data structures
- Use React Query or SWR for server state management

### Hooks and Effects
- Use `useEffect` with proper dependency arrays to avoid infinite loops
- Implement cleanup functions in effects to prevent memory leaks
- Use `useMemo` and `useCallback` for performance optimization when needed
- Create custom hooks for reusable stateful logic
- Follow the rules of hooks (only call at the top level)
- Use `useRef` for accessing DOM elements and storing mutable values

### Styling
- **Use shadcn/ui components with Tailwind CSS** - follow shadcn/ui's design system
- Use the `cn()` utility function for conditional className composition
- Leverage shadcn/ui's built-in variants and design tokens
- Use CSS Modules, Styled Components, or Tailwind for custom styling needs
- Implement responsive design with mobile-first approach
- Follow consistent naming conventions for custom CSS classes
- Use CSS custom properties (variables) for theming - integrate with shadcn/ui themes
- Implement consistent spacing, typography, and color systems from shadcn/ui
- Ensure accessibility with proper ARIA attributes and semantic HTML

### Performance Optimization
- Use `React.memo` for component memoization when appropriate
- Implement code splitting with `React.lazy` and `Suspense`
- Optimize bundle size with tree shaking and dynamic imports
- Use `useMemo` and `useCallback` judiciously to prevent unnecessary re-renders
- Implement virtual scrolling for large lists
- Profile components with React DevTools to identify performance bottlenecks

### Data Fetching
- Use modern data fetching libraries (React Query, SWR, Apollo Client)
- Implement proper loading, error, and success states
- Handle race conditions and request cancellation
- Use optimistic updates for better user experience
- Implement proper caching strategies
- Handle offline scenarios and network errors gracefully

### Error Handling
- Implement Error Boundaries for component-level error handling
- Use proper error states in data fetching
- Implement fallback UI for error scenarios
- Log errors appropriately for debugging
- Handle async errors in effects and event handlers
- Provide meaningful error messages to users

### Forms and Validation
- Use controlled components for form inputs
- Implement proper form validation with libraries like Formik, React Hook Form
- Handle form submission and error states appropriately
- Implement accessibility features for forms (labels, ARIA attributes)
- Use debounced validation for better user experience
- Handle file uploads and complex form scenarios

### Routing
- Use React Router for client-side routing
- Implement nested routes and route protection
- Handle route parameters and query strings properly
- Implement lazy loading for route-based code splitting
- Use proper navigation patterns and back button handling
- Implement breadcrumbs and navigation state management

### Testing
- Write unit tests for components using React Testing Library
- Test component behavior, not implementation details
- Use Jest for test runner and assertion library
- Implement integration tests for complex component interactions
- Mock external dependencies and API calls appropriately
- Test accessibility features and keyboard navigation

### Security
- Sanitize user inputs to prevent XSS attacks
- Validate and escape data before rendering
- Use HTTPS for all external API calls
- Implement proper authentication and authorization patterns
- Avoid storing sensitive data in localStorage or sessionStorage
- Use Content Security Policy (CSP) headers

### Accessibility
- Use semantic HTML elements appropriately
- Implement proper ARIA attributes and roles
- Ensure keyboard navigation works for all interactive elements
- Provide alt text for images and descriptive text for icons
- Implement proper color contrast ratios
- Test with screen readers and accessibility tools

## Implementation Process
1. Plan component architecture and data flow
2. Set up project structure with proper folder organization
3. Define TypeScript interfaces and types
4. Implement core components with proper styling
5. Add state management and data fetching logic
6. Implement routing and navigation
7. Add form handling and validation
8. Implement error handling and loading states
9. Add testing coverage for components and functionality
10. Optimize performance and bundle size
11. Ensure accessibility compliance
12. Add documentation and code comments

## Additional Guidelines
- Follow React's naming conventions (PascalCase for components, camelCase for functions)
- Use meaningful commit messages and maintain clean git history
- Implement proper code splitting and lazy loading strategies
- Document complex components and custom hooks with JSDoc
- Use ESLint and Prettier for consistent code formatting
- Keep dependencies up to date and audit for security vulnerabilities
- Implement proper environment configuration for different deployment stages
- Use React Developer Tools for debugging and performance analysis

## Common Patterns
- Higher-Order Components (HOCs) for cross-cutting concerns
- Render props pattern for component composition
- Compound components for related functionality
- Provider pattern for context-based state sharing
- Container/Presentational component separation
- Custom hooks for reusable logic extraction