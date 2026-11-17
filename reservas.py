# reservas.py - Reservas y control de aforo

from config import AFORO_MAXIMO

reservas = []


def reservar(estudiante):
    """Registra una reserva si aún hay aforo disponible."""
    if len(reservas) >= AFORO_MAXIMO:
        return False
    reservas.append(estudiante)
    return True


def cupos_disponibles():
    return AFORO_MAXIMO - len(reservas)
