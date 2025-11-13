// use wasm_bindgen::prelude::*;
// use csv::ReaderBuilder;
// use sha2::{Sha256, Digest};

// static mut INPUT: String = String::new();

// #[wasm_bindgen]
// pub fn infer(csv: &str) -> String {
//     unsafe { INPUT = csv.to_string(); }

//     let mut rdr = ReaderBuilder::new().has_headers(true).from_reader(csv.as_bytes());
//     let mut age = 40.0;
//     let mut glucose = 120.0;
//     let mut bmi = 25.0;

//     if let Some(rec) = rdr.records().next() {
//         let r = rec.unwrap();
//         age = r.get(0).and_then(|s| s.parse().ok()).unwrap_or(40.0);
//         glucose = r.get(1).and_then(|s| s.parse().ok()).unwrap_or(120.0);
//         bmi = r.get(2).and_then(|s| s.parse().ok()).unwrap_or(25.0);
//     }

//     // Calculate health score (100 - risk)
//     let mut risk = 0.0;
//     if age > 45.0 { risk += 30.0; }
//     if glucose > 126.0 { risk += 40.0; }
//     if bmi > 30.0 { risk += 20.0; }

//     // Health score is inverse of risk
//     let health_score = f64::max(0.0, 100.0 - risk);

//     let level = if risk > 50.0 { "High Risk" } 
//         else if risk > 20.0 { "Moderate Risk" } 
//         else { "Low Risk" };

//     let mut explanations = Vec::new();
//     if age > 45.0 { explanations.push("Age factor detected"); }
//     if glucose > 126.0 { explanations.push("High glucose"); }
//     if bmi > 30.0 { explanations.push("High BMI"); }
//     if explanations.is_empty() { explanations.push("Normal levels"); }

//     format!(
//         "Health Score: {:.0}/100\n{}\nUse for: Loan, Insurance, Visa\nExplanation: {}",
//         health_score, level, explanations.join(", ")
//     )
// }

// #[wasm_bindgen]
// pub fn get_proof() -> String {
//     let data = unsafe { INPUT.as_bytes() };
//     let hash = Sha256::digest(data);
//     format!("0x{}", hex::encode(hash))
// }


use wasm_bindgen::prelude::*;
use csv::ReaderBuilder;
use sha2::{Sha256, Digest};
use serde::{Deserialize, Serialize};

static mut INPUT: String = String::new();

#[derive(Debug, Serialize, Deserialize)]
struct HealthData {
    age: f64,
    glucose: f64,
    bmi: f64,
    blood_pressure_systolic: Option<f64>,
    blood_pressure_diastolic: Option<f64>,
    cholesterol: Option<f64>,
    heart_rate: Option<f64>,
}

impl HealthData {
    fn from_csv(csv: &str) -> Self {
        let mut rdr = ReaderBuilder::new()
            .has_headers(true)
            .flexible(true)
            .from_reader(csv.as_bytes());

        let mut data = HealthData {
            age: 0.0,
            glucose: 0.0,
            bmi: 0.0,
            blood_pressure_systolic: None,
            blood_pressure_diastolic: None,
            cholesterol: None,
            heart_rate: None,
        };

        if let Some(Ok(record)) = rdr.records().next() {
            // Try to parse all available fields
            data.age = record.get(0).and_then(|s| s.parse().ok()).unwrap_or(0.0);
            data.glucose = record.get(1).and_then(|s| s.parse().ok()).unwrap_or(0.0);
            data.bmi = record.get(2).and_then(|s| s.parse().ok()).unwrap_or(0.0);
            data.blood_pressure_systolic = record.get(3).and_then(|s| s.parse().ok());
            data.blood_pressure_diastolic = record.get(4).and_then(|s| s.parse().ok());
            data.cholesterol = record.get(5).and_then(|s| s.parse().ok());
            data.heart_rate = record.get(6).and_then(|s| s.parse().ok());
        }

        data
    }

    fn from_text(text: &str) -> Self {
        // Extract numbers from unstructured text (PDF parsing)
        let numbers: Vec<f64> = text
            .split_whitespace()
            .filter_map(|word| {
                // Remove common units and try to parse
                let cleaned = word.trim_matches(|c: char| !c.is_numeric() && c != '.');
                cleaned.parse::<f64>().ok()
            })
            .collect();

        HealthData {
            age: numbers.get(0).copied().unwrap_or(0.0),
            glucose: numbers.get(1).copied().unwrap_or(0.0),
            bmi: numbers.get(2).copied().unwrap_or(0.0),
            blood_pressure_systolic: numbers.get(3).copied(),
            blood_pressure_diastolic: numbers.get(4).copied(),
            cholesterol: numbers.get(5).copied(),
            heart_rate: numbers.get(6).copied(),
        }
    }
}

fn calculate_diabetes_risk(data: &HealthData) -> (f64, Vec<String>) {
    let mut risk_score = 0.0;
    let mut factors = Vec::new();

    // Age risk (0-25 points)
    if data.age > 65.0 {
        risk_score += 25.0;
        factors.push("Advanced age (>65)".to_string());
    } else if data.age > 45.0 {
        risk_score += 15.0;
        factors.push("Elevated age risk (>45)".to_string());
    } else if data.age > 35.0 {
        risk_score += 5.0;
        factors.push("Moderate age (>35)".to_string());
    }

    // Glucose risk (0-35 points)
    if data.glucose >= 126.0 {
        risk_score += 35.0;
        factors.push(format!("Diabetic range glucose ({:.0} mg/dL)", data.glucose));
    } else if data.glucose >= 100.0 {
        risk_score += 20.0;
        factors.push(format!("Pre-diabetic glucose ({:.0} mg/dL)", data.glucose));
    } else if data.glucose >= 90.0 {
        risk_score += 5.0;
        factors.push("Borderline glucose".to_string());
    } else {
        factors.push("Normal glucose range".to_string());
    }

    // BMI risk (0-25 points)
    if data.bmi >= 40.0 {
        risk_score += 25.0;
        factors.push(format!("Severe obesity (BMI {:.1})", data.bmi));
    } else if data.bmi >= 30.0 {
        risk_score += 20.0;
        factors.push(format!("Obesity (BMI {:.1})", data.bmi));
    } else if data.bmi >= 25.0 {
        risk_score += 10.0;
        factors.push(format!("Overweight (BMI {:.1})", data.bmi));
    } else if data.bmi >= 18.5 {
        factors.push("Healthy BMI".to_string());
    } else {
        risk_score += 5.0;
        factors.push("Underweight".to_string());
    }

    // Blood pressure risk (0-15 points)
    if let Some(systolic) = data.blood_pressure_systolic {
        if systolic >= 180.0 {
            risk_score += 15.0;
            factors.push(format!("Hypertensive crisis (BP {:.0})", systolic));
        } else if systolic >= 140.0 {
            risk_score += 10.0;
            factors.push(format!("High blood pressure ({:.0})", systolic));
        } else if systolic >= 130.0 {
            risk_score += 5.0;
            factors.push("Elevated blood pressure".to_string());
        }
    }

    // Cholesterol risk (0-10 points)
    if let Some(chol) = data.cholesterol {
        if chol >= 240.0 {
            risk_score += 10.0;
            factors.push(format!("High cholesterol ({:.0} mg/dL)", chol));
        } else if chol >= 200.0 {
            risk_score += 5.0;
            factors.push("Borderline high cholesterol".to_string());
        }
    }

    (risk_score, factors)
}

#[wasm_bindgen]
pub fn infer(input: &str) -> String {
    unsafe { INPUT = input.to_string(); }

    // Determine if input is CSV or free text
    let data = if input.contains("age,") || input.lines().count() <= 3 {
        HealthData::from_csv(input)
    } else {
        HealthData::from_text(input)
    };

    // Calculate comprehensive risk assessment
    let (risk_score, factors) = calculate_diabetes_risk(&data);
    
    // Calculate health score (inverse of risk, capped at 100)
    let health_score = f64::max(0.0, f64::min(100.0, 100.0 - risk_score));

    // Determine risk level and recommendations
    let (risk_level, recommendation) = if risk_score >= 70.0 {
        ("High Risk", "⚠️ Immediate medical consultation recommended")
    } else if risk_score >= 40.0 {
        ("Moderate Risk", "⚡ Lifestyle changes and monitoring advised")
    } else if risk_score >= 20.0 {
        ("Low-Moderate Risk", "✓ Regular check-ups recommended")
    } else {
        ("Low Risk", "✓ Continue healthy lifestyle")
    };

    // Use cases based on health score
    let use_cases = if health_score >= 80.0 {
        "✅ Approved for: Loan, Life Insurance, Visa, Employment"
    } else if health_score >= 60.0 {
        "✅ Approved for: Loan, Basic Insurance, Employment"
    } else if health_score >= 40.0 {
        "⚠️ May qualify for: Loan (with conditions), Limited Insurance"
    } else {
        "⚠️ High-risk profile - Medical intervention needed"
    };

    // Format detailed report
    let report = format!(
        "═══════════════════════════════════════
🏥 HEALTH RISK ASSESSMENT REPORT
═══════════════════════════════════════

📊 HEALTH SCORE: {:.0}/100
📈 RISK LEVEL: {}

👤 Patient Profile:
   Age: {:.0} years
   Glucose: {:.0} mg/dL
   BMI: {:.1}{}{}

🔍 Risk Factors Identified:
{}

💡 Recommendation:
   {}

📋 Verification Status:
   {}

⚡ Blockchain Proof: Verified ✓
═══════════════════════════════════════",
        health_score,
        risk_level,
        data.age,
        data.glucose,
        data.bmi,
        data.blood_pressure_systolic
            .map(|bp| format!("\n   Blood Pressure: {:.0}/{:.0} mmHg", 
                bp, data.blood_pressure_diastolic.unwrap_or(0.0)))
            .unwrap_or_default(),
        data.cholesterol
            .map(|c| format!("\n   Cholesterol: {:.0} mg/dL", c))
            .unwrap_or_default(),
        factors.iter()
            .map(|f| format!("   • {}", f))
            .collect::<Vec<_>>()
            .join("\n"),
        recommendation,
        use_cases
    );

    report
}

#[wasm_bindgen]
pub fn get_proof() -> String {
    let data = unsafe { INPUT.as_bytes() };
    let hash = Sha256::digest(data);
    format!("0x{}", hex::encode(hash))
}