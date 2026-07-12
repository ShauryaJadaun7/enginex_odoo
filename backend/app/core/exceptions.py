from fastapi import HTTPException, status

class BusinessRuleViolation(Exception):
    """Exception raised when a business rule is violated (e.g. overloading a vehicle)."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class ExpiredLicenseException(HTTPException):
    """Exception raised when onboarding or assigning a driver with an expired license."""
    def __init__(self, detail: str = "Cannot onboard or assign a driver with an expired license."):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class DriverSuspendedException(HTTPException):
    """Exception raised when a driver is suspended due to safety violations."""
    def __init__(self, detail: str = "Driver is currently suspended due to safety violations."):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

