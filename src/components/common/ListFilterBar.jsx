import TagFilterChips from "@/components/common/TagFilterChips";
import FilterPickerRow from "@/components/common/FilterPickerRow";

export default function ListFilterBar({ tagItems, tagActive, onTagToggle, tagActiveClass, tagInactiveClass, children }) {
  return (
    <div className="space-y-3 mb-4">
      {tagItems?.length > 0 && (
        <TagFilterChips
          items={tagItems}
          active={tagActive}
          onToggle={onTagToggle}
          activeClass={tagActiveClass}
          inactiveClass={tagInactiveClass}
        />
      )}
      {children && <FilterPickerRow>{children}</FilterPickerRow>}
    </div>
  );
}
