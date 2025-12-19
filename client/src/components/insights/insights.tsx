import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  insights: Insight[];
  className?: string;
};

export const Insights = ({ insights, className }: InsightsProps) => {
  const deleteInsight = async (id: number) => {
    if (!confirm("Are you sure you want to delete this insight?")) return;

    try {
      const response = await fetch("/api/insights/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        console.error("Failed to delete insight:", error);
        alert("Failed to delete insight");
      }
    } catch (error) {
      console.error("Error deleting insight:", error);
      alert("Error deleting insight");
    }
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length ? (
          insights.map(({ id, text, createdAt, brand }) => (
            <div className={styles.insight} key={id}>
              <div className={styles["insight-meta"]}>
                <span>{brand}</span>
                <div className={styles["insight-meta-details"]}>
                  <span>{createdAt.toString()}</span>
                  <Trash2Icon
                    className={styles["insight-delete"]}
                    onClick={() => deleteInsight(id)}
                  />
                </div>
              </div>
              <p className={styles["insight-content"]}>{text}</p>
            </div>
          ))
        ) : (
          <p>We have no insight!</p>
        )}
      </div>
    </div>
  );
};
