class BusinessRuleViolation(Exception):
    """Exception raised when a business rule is violated (e.g. overloading a vehicle)."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
