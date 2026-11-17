# menu.py - Menú del día (RF03)

MENU_DEL_DIA = {
    "entrada": "Sopa de quinua",
    "segundo": "Arroz con pollo",
    "refresco": "Chicha morada",
    "postre": "Gelatina",
}


def mostrar_menu():
    """Muestra el menú del día."""
    print("=== MENÚ DEL DÍA ===")
    for tipo, plato in MENU_DEL_DIA.items():
        print(f"{tipo.capitalize()}: {plato}")


if __name__ == "__main__":
    mostrar_menu()
