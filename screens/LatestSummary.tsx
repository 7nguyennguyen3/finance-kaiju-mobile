import { StyleSheet, View } from "react-native";
import KeyHighlights from "../components/KeyHighlights";
import LatestTransactions from "../components/LatestTransactions";
import ProgressTrack from "../components/ui/ProgressTrack";
import { colors } from "../constants/colors";
import globalStyles from "../constants/globalStyles";
import { useExpensesData } from "../store/expenses-filtering";
import { useContext, useEffect } from "react";
import { getDocs, query, collection, where, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import { GoalContext } from "../store/goal-context";

const Home = () => {
  const {
    filteredExpenses,
    displayExpenses,
    latestMonthDeposit,
    latestMonthExpenses,
  } = useExpensesData();

  const {
    userEmail,
    budgetGoal,
    depositGoal,
    setBudgetGoal,
    setDepositGoal,
    setDocId,
  } = useContext(GoalContext);

  const depositProgress = Number(latestMonthDeposit) / depositGoal;
  const spendingRemaining = budgetGoal - Number(latestMonthExpenses);
  const spendingRemainingProgress = spendingRemaining / budgetGoal;

  useEffect(() => {
    if (userEmail) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(
            query(
              collection(FIRESTORE_DB, "goals"),
              where("userEmail", "==", userEmail)
            )
          );

          if (!querySnapshot.empty) {
            const firstDoc = querySnapshot.docs[0];
            const data = firstDoc.data();

            if (data.budgetGoal && data.depositGoal) {
              setDocId(firstDoc.id);
              setBudgetGoal(data.budgetGoal);
              setDepositGoal(data.depositGoal);
            }
          } else {
            await addDoc(collection(FIRESTORE_DB, "goals"), {
              userEmail,
              budgetGoal,
              depositGoal,
            });
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [userEmail]);

  return (
    <View style={[globalStyles.container]}>
      <KeyHighlights
        filteredExpenses={filteredExpenses}
        latestMonthDeposit={latestMonthDeposit}
        latestMonthExpenses={latestMonthExpenses.toString()}
      />
      <View>
        <ProgressTrack
          condition={depositProgress > 0.8}
          iconName={depositProgress >= 1 ? "star" : "thumbs-up"}
          goalType="deposit"
          goal={depositGoal}
          description="Deposit"
          progress={Number(latestMonthDeposit) / depositGoal}
          color={
            depositProgress > 0.4
              ? colors.primary500
              : depositProgress > 0.6
              ? colors.primary700
              : depositGoal > 0.8
              ? colors.primary800
              : colors.primary200
          }
          goalProgress={`$${Number(depositGoal.toFixed(2))}`}
        />
        <ProgressTrack
          condition={spendingRemainingProgress > 0.3}
          iconName={
            spendingRemainingProgress >= 0.6
              ? "star"
              : spendingRemainingProgress >= 0.4
              ? "thumbs-up"
              : "thumbs-up"
          }
          goalType="budget"
          goal={budgetGoal}
          description="Budget"
          progress={spendingRemaining / budgetGoal}
          color={
            spendingRemainingProgress > 0.6
              ? colors.primary500
              : spendingRemainingProgress > 0.3
              ? colors.accent800
              : colors.error500
          }
          goalProgress={`$${Number(spendingRemaining.toFixed(2))}`}
        />
      </View>
      <LatestTransactions latestExpenses={displayExpenses} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
