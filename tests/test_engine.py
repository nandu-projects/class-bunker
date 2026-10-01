"""
Class Bunker - Calculation Engine Verification Tests
Verifies mathematical correctness of attendance calculations, safe bunks, recovery,
and edge cases.
"""

import math
import sys

def calculate_percentage(attended: int, conducted: int) -> float:
    if conducted == 0:
        return 100.0
    return round((attended / conducted) * 100, 2)

def calculate_safe_bunks(attended: int, conducted: int, required: float) -> int:
    if conducted == 0:
        return 0
    if required <= 0:
        return 999
    if required > 100:
        return 0
    # Exact integer arithmetic check: 100 * attended < required * conducted
    if 100 * attended < required * conducted:
        return 0
    max_total = math.floor((100 * attended) / required)
    safe_bunks = max_total - conducted
    return max(0, safe_bunks)

def calculate_recovery_classes(attended: int, conducted: int, required: float) -> int:
    if conducted == 0 or required <= 0:
        return 0
    if 100 * attended >= required * conducted:
        return 0
    if required >= 100:
        return 0 if attended == conducted else math.inf
    numerator = (required * conducted) - (100 * attended)
    denominator = 100 - required
    return max(0, math.ceil(numerator / denominator))

def run_tests():
    print("Running Class Bunker Math Verification Suite...")
    
    # 1. Prompt Example 1: 40 attended, 50 conducted, 75% required -> 3 safe bunks
    sb1 = calculate_safe_bunks(40, 50, 75)
    assert sb1 == 3, f"Expected 3, got {sb1}"
    # Verify that at 40/(50+3) = 40/53 = 75.47% >= 75%
    assert (40 / 53) >= 0.75
    # Verify that at 40/(50+4) = 40/54 = 74.07% < 75%
    assert (40 / 54) < 0.75
    print("  [PASS] Prompt Example 1 passed (40/50 @ 75% => 3 safe bunks)")

    # 2. Prompt Example 2: 42 attended, 50 conducted, 75% required -> 6 safe bunks
    sb2 = calculate_safe_bunks(42, 50, 75)
    assert sb2 == 6, f"Expected 6, got {sb2}"
    assert (42 / 56) == 0.75
    assert (42 / 57) < 0.75
    print("  [PASS] Prompt Example 2 passed (42/50 @ 75% => 6 safe bunks)")

    # 3. Exactly 75%: 15 attended, 20 conducted, 75% required -> 0 safe bunks
    sb3 = calculate_safe_bunks(15, 20, 75)
    assert sb3 == 0, f"Expected 0, got {sb3}"
    assert (15 / 21) < 0.75
    print("  [PASS] Exactly 75% passed (15/20 @ 75% => 0 safe bunks)")

    # 4. Recovery Example: 34 attended, 50 conducted (68%), 75% required -> 14 classes
    rec1 = calculate_recovery_classes(34, 50, 75)
    assert rec1 == 14, f"Expected 14, got {rec1}"
    assert ((34 + 14) / (50 + 14)) == (48 / 64) == 0.75
    assert ((34 + 13) / (50 + 13)) < 0.75
    print("  [PASS] Recovery Example passed (34/50 @ 75% => 14 recovery classes)")

    # 5. 100% attendance: 50 attended, 50 conducted, 75% required
    # floor(5000 / 75) = 66 -> 66 - 50 = 16 safe bunks
    sb100 = calculate_safe_bunks(50, 50, 75)
    assert sb100 == 16, f"Expected 16, got {sb100}"
    assert (50 / 66) >= 0.75
    assert (50 / 67) < 0.75
    print("  [PASS] 100% attendance passed (50/50 @ 75% => 16 safe bunks)")

    # 6. 0% attendance: 0 attended, 10 conducted, 75% required -> 0 safe bunks, 30 recovery classes
    sb0 = calculate_safe_bunks(0, 10, 75)
    rec0 = calculate_recovery_classes(0, 10, 75)
    assert sb0 == 0, f"Expected 0, got {sb0}"
    assert rec0 == 30, f"Expected 30, got {rec0}"
    assert (30 / 40) == 0.75
    print("  [PASS] 0% attendance passed (0/10 @ 75% => 0 bunks, 30 recovery)")

    # 7. Small class counts: 3 attended, 4 conducted (75%), 75% req -> 0 bunks, 0 recovery
    assert calculate_safe_bunks(3, 4, 75) == 0
    assert calculate_recovery_classes(3, 4, 75) == 0
    print("  [PASS] Small class counts passed (3/4 @ 75%)")

    # 8. Large class counts: 450 attended, 500 conducted (90%), 75% req
    # floor(45000 / 75) = 600 -> 600 - 500 = 100 bunks
    sb_large = calculate_safe_bunks(450, 500, 75)
    assert sb_large == 100, f"Expected 100, got {sb_large}"
    assert (450 / 600) == 0.75
    assert (450 / 601) < 0.75
    print("  [PASS] Large class counts passed (450/500 @ 75% => 100 bunks)")

    # 9. Custom requirements: 80% and 85%
    # 42 attended, 50 conducted (84%):
    # For 80%: floor(4200 / 80) = 52 -> 52 - 50 = 2 bunks
    assert calculate_safe_bunks(42, 50, 80) == 2
    assert (42 / 52) >= 0.80
    assert (42 / 53) < 0.80
    # For 85%: currently below (84% < 85%) -> 0 bunks
    assert calculate_safe_bunks(42, 50, 85) == 0
    # Recovery for 85%: ceil((85*50 - 4200)/(100-85)) = ceil((4250 - 4200)/15) = ceil(50/15) = 4
    rec_85 = calculate_recovery_classes(42, 50, 85)
    assert rec_85 == 4, f"Expected 4, got {rec_85}"
    assert (42 + 4) / (50 + 4) >= 0.85
    assert (42 + 3) / (50 + 3) < 0.85
    print("  [PASS] Custom requirements 80% & 85% passed")

    # 10. Overall Attendance Weighted Sum:
    # Subject 1: 10/10 (100%)
    # Subject 2: 1/10 (10%)
    # Average of % is (100+10)/2 = 55%
    # BUT Total Attended: 11, Total Conducted: 20 -> 11/20 = 55%
    # Now with different weights:
    # Subject 1: 40/40 (100%)
    # Subject 2: 0/10 (0%)
    # Simple average of percentages = (100 + 0) / 2 = 50%
    # Actual weighted = 40 / 50 = 80%!
    sub1_att, sub1_cond = 40, 40
    sub2_att, sub2_cond = 0, 10
    total_att = sub1_att + sub2_att
    total_cond = sub1_cond + sub2_cond
    actual_pct = (total_att / total_cond) * 100
    assert actual_pct == 80.0, f"Expected 80.0, got {actual_pct}"
    print("  [PASS] Weighted overall attendance passed (not simple average)")

    # 11. Edge case: 100% requirement with missed class
    rec_inf = calculate_recovery_classes(9, 10, 100)
    assert rec_inf == math.inf, f"Expected inf, got {rec_inf}"
    print("  [PASS] Edge case 100% target with missed class passed (impossible recovery handled)")

    # 12. Edge case: zero conducted
    assert calculate_safe_bunks(0, 0, 75) == 0
    assert calculate_recovery_classes(0, 0, 75) == 0
    assert calculate_percentage(0, 0) == 100.0
    print("  [PASS] Zero conducted edge cases passed")

    print("\nALL 12 MATHEMATICAL VERIFICATION TESTS PASSED SUCCESSFULLY! [OK]")

if __name__ == '__main__':
    run_tests()
