"""API package initialization."""


def __getattr__(name: str):
    if name == "api_router":
        from backend.api.routes import api_router
        return api_router
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


__all__ = ["api_router"]

