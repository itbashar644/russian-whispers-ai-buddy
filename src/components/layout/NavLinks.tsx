
import React from 'react';
import { NavLink } from 'react-router-dom';

export const NavLinks: React.FC = () => {
  return (
    <nav className="hidden md:flex gap-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        }
      >
        Главная
      </NavLink>
      <NavLink
        to="/catalog"
        className={({ isActive }) =>
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        }
      >
        Каталог
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        }
      >
        О нас
      </NavLink>
      <NavLink
        to="/contacts"
        className={({ isActive }) =>
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        }
      >
        Контакты
      </NavLink>
    </nav>
  );
};
