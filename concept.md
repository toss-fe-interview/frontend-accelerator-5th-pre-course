- 1.  이름만 보자
- savingsCalculator -> 음.. 뭔가 적금 계산기. 적금을 얼마를 넣을지 이자가 얼마인지 알면 최종 금액을 알 수 있겠다 싶음
- 2.  props
- amount, period, products, onChangeAmount, onChangePeriod
- 계산을 하기 위해서 필요한 정보들인데.. onChangeAmount, onChangePeriod는 필요없지 않나? 그걸 알아서 계산해줘야할 것 같은데..
-
- 아.. 그런데 products가 있는걸 보니, 그 조건에 맞는 데이터를 불러오는 것 같은데 그럼 이건 그냥 계산기가 아니라,
- 내가 입력한 조건에 맞는 상품을 추천해주는 프로그램이다.

---

이 제품의 본질

1. 사용자가 원하는 조건(목표) 입력
2. 조건에 맞는 상품 목록 출력
3. 선택된 상품 기준으로 계산
4. 계산 결과 출력

이걸 한마디로? BestMatchingSavingsCalculator

---

그렇다면 절대 바뀌지 않는 부분

1. 사용자의 저축 목표 데이터 - UserSavingGoalData
2. 적금 상품에서 어떤 데이터를 보여줄지 - SavingsProductData
3. 선택된 상품의 데이터 - SelectedSavingsProductData
4. 계산 결과에서 어떤 데이터를 보여줄지 - CalculationResultData

---

1. 저축 목표 입력창 UserSavingGoalInputForm

- 목표금액 UserSavingGoalData.targetAmount
- 월 납입액 UserSavingGoalData.monthlyMinAmount, UserSavingGoalData.monthlyMaxAmount
- 저축 기간 UserSavingGoalData.savingTerm

2. 적금 상품 목록 SavingsProductList

- 데이터 불러와서 보여주기(원단위 콤마 표시)
  - 상품 이름 SavingsProductData.name
  - 연이자율 SavingsProductData.annualRate
  - 최소 월 납입액 SavingsProductData.minMonthlyAmount
  - 최대 월 납입액 SavingsProductData.maxMonthlyAmount
  - 저축 기간 SavingsProductData.availableTerms
- 조건에 맞게 데이터 필터링
  1. 최소 월 납입액 이상 UserSavingGoalData.monthlyMinAmount
  2. 최대 월 납입액 이하 UserSavingGoalData.monthlyMaxAmount
  3. 저축 기간 일치 UserSavingGoalData.savingTerm
- 선택된 상품은 선택 아이콘 표기 SelectedSavingsProductData.isSelected

3. 계산 결과 탭 CalculationResultTab

- 선택된 상품 기준으로 계산 CalculationResultData
  - 예상 수익 금액 CalculationResultData.expectedProfit
  - 목표 금액과의 차이 CalculationResultData.targetAmountDifference
  - 추천 월 납입 금액 CalculationResultData.recommendedMonthlyAmount

  - 예상 수익 금액
    - 공식: `최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)`
  - 목표 금액과의 차이
    - 공식: `목표 금액과의 차이 = 목표 금액 - 예상 수익 금액`
  - 추천 월 납입 금액
    - 공식: `월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))`

- 추천 상품 목록 RecommendedSavingsProductList
  - 필터링 된 상품 중 연이자율 상위 2개 상품 출력 RecommendedSavingsProductList.top2RecommendedSavingsProducts
  - 선택된 상품은 선택 아이콘 표기 RecommendedSavingsProductList.isSelected

4. 부가기능

- 선택된 탭에 따라 목록을 보여줄지 계산 결과를 보여줄지 결정(기획 유)
- 데이터는 하나만 선택 가능(기획 유)
- 사용자 입력 조건이 없을 경우 모든 데이터를 보여주기(기획 무)
- 선택된 데이터를 다시 한번 눌렀을 때 선택 상품 토글(기획 무)

4. 확장성을 고려한다면?

- 예를 들어 입력영역 ui를 바꾼다면? 슬라이더로, 그리고 기간은 버튼으로.. -> 이 파일에서 어디까지 건드릴 것 같아?
- amount, period가 핵심이다. 이걸 슬라이더, 버튼 등등 ui를 바꾼다해도 계산기의 본질 자체는 안바뀜.
