
# PERFORMANCE TESTING USING JMETER

## Overview
This repository contains a JMeter project for performance testing of the [DemoQA](https://demoqa.com/) website.

## Test Plan Components
The sample test plan includes the following components:

1. **Thread Group**: 
   - Thread Count: 10
   - Ramp-Up Time: 1 second
   - Explanation:
     - **Thread Count**: Represents the number of virtual users (threads) executing the test concurrently.
     - **Ramp-Up Time**: Represents the time taken for all threads to start executing.

2. **HTTP Proxy Server**:
   - Used for recording the script of sample pages.

3. **Logic Controllers**:
   - **Loop Controller**:
     - Loop Count: 5
   - **ForEach Controller**:
     - Start and end index specified.

4. **Config Elements**:
   - **CSV Data Set Config**:
     - Reads login name and password from a CSV file.

5. **Listeners**:
   - **View Results Tree**
   - **Simple Data Writer**: Writes results to a JTL file.
   - **Aggregate Graph**
   - **Aggregate Report**
   - **Summary Report**

6. **Timers**:
   - **Constant Timer**
   - **Uniform Random Timer**

7. **Assertions**:
   - **Size Assertion**
   - **Duration Assertion**
   - **Response Assertion**
   - **HTML Assertion**
   - **Compare Assertion**

8. **Save and Run the Test Plan**.

9. **Sequential Execution**:
   - Run Thread Group of steps 1 and 9 in a sequential manner by changing properties in the Test Plan.

10. **Point to Explore**:
    - Running through CMD (Non GUI mode).

## Usage
1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/vrun545/JMeter_Demo.git
    ```

2. Open JMeter and load the test plan named "DemoQA.jmx".

3. Configure the necessary settings and parameters in the test plan.

4. Run the test plan.

## Running in CMD (Non GUI mode)
To run the test plan through CMD (Non GUI mode), use the following command:

```bash
jmeter -n -t DemoQA.jmx -l test_results.jtl
```

This command runs JMeter in non-GUI mode (`-n`), specifies the test plan file (`-t`), and writes the results to a JTL file (`-l`).

---

Feel free to customize the README file further based on your project requirements and additional details.
