import { useUserSavingGoalStore } from 'store/useUserSavingGoalStore';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

const UserSavingGoalSection = () => {
  const { userSavingGoal, setUserSavingGoal } = useUserSavingGoalStore();

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        onChange={e => setUserSavingGoal({ ...userSavingGoal, targetAmount: Number(e.target.value) })}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        onChange={e => setUserSavingGoal({ ...userSavingGoal, monthlyAmount: Number(e.target.value) })}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={userSavingGoal.term}
        onChange={value => setUserSavingGoal({ ...userSavingGoal, term: value })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
};

export default UserSavingGoalSection;
