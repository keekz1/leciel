interface MenuItemProps {
  name: string;
  price: string;
}

export default function MenuItem({ name, price }: MenuItemProps) {
  return (
    <div className="menu-item-card">
      <span>{name}</span>
      <span>{price}</span>
    </div>
  );
}
