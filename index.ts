#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";

// Customer class
class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mobNumber: number;
  accNumber: number;

  constructor(
    fName: string,
    lName: string,
    age: number,
    gender: string,
    mob: number,
    acc: number
  ) {
    this.firstName = fName;
    this.lastName = lName;
    this.age = age;
    this.gender = gender;
    this.mobNumber = mob;
    this.accNumber = acc;
  }
}

// BankAccount interface
interface BankAccount {
  accNumber: number;
  balance: number;
}

// Bank class
class Bank {
  customer: Customer[] = [];
  account: BankAccount[] = [];

  addCustomer(obj: Customer) {
    this.customer.push(obj);
  }

  addAccountNumber(obj: BankAccount) {
    this.account.push(obj);
  }
}

let mybank = new Bank();

// Customer creation
for (let i: number = 1; i <= 3; i++) {
  let fName = faker.person.firstName('male');
  let lName = faker.person.lastName();
  let num = parseInt(faker.phone.number("3#########"));
  const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
  mybank.addCustomer(cus);
  mybank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}

// Bank functionality
async function bankService(params: Bank) {
  let exit = false; // Exit flag to control the loop

  while (!exit) { // While loop to keep the application running

    let service = await inquirer.prompt({
      type: "list",
      name: "select",
      message: "Please Select the Service",
      choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"] // Added an "Exit" option
    });

    if (service.select == "View Balance") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Please Enter your Account Number:"
      });

      const account = mybank.account.find((acc) => acc.accNumber == parseInt(res.num));

      if (!account) {
        console.log(chalk.red.bold("Invalid Account"));
      } else {
        const customer = mybank.customer.find((cus) => cus.accNumber == account.accNumber);
        if (customer) {
          console.log(`Dear ${customer.firstName} ${customer.lastName}, your Account Balance is $${account.balance}`);
        } else {
          console.log(chalk.red.bold("Customer not found"));
        }
      }
    } else if (service.select == "Cash Withdraw") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Please Enter your Account Number:"
      });

      const account = mybank.account.find((acc) => acc.accNumber == Number(res.num));

      if (!account) {
        console.log(chalk.red.bold("Invalid Account"));
      } else {
        let amount = await inquirer.prompt({
          type: "input",
          name: "amount",
          message: "Please Enter your amount."
        });

        let amountNum = Number(amount.amount);

        if (amountNum <= 0) {
          console.log(chalk.red.bold("Invalid amount"));
        } else if (amountNum > account.balance) {
          console.log(chalk.red.bold("Majuda Balance Nakfi hay"));
        } else {
          account.balance -= amountNum;
          console.log(`_______`);
        }
      }
    } else if (service.select == "Cash Deposit") {
      console.log("Cash Deposit");
    } else if (service.select == "Exit") {
      console.log("Exiting the application");
      exit = true; // Set the exit flag to true to exit the loop
    }
  }
}

bankService(mybank);