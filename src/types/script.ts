import { HaBaseDevice } from "./baseDevice";
import { OnOff, Program } from "@scrypted/sdk";
import { HaDomain } from "../utils";
import { sleep } from "../../../scrypted/common/src/sleep";

export class HaScript extends HaBaseDevice implements Program, OnOff {
    updateState() {
    }

    async run(variables?: { [name: string]: any; }): Promise<any> {
        const scriptName = this.entityId.split('.')[1];

        await this.getActionFn(`services/${HaDomain.Script}/${scriptName}`, variables)();
    }

    turnOff(): Promise<void> {
        this.on = false;

        return;
    }

    async turnOn(): Promise<void> {
        return new Promise(async (resolve) => {
            this.on = true;

            // Variables can be passed to scripts. Ideally could just be done adding a storage on the switch
            // and add settings to populate the variables
            await this.getActionFn(`services/${HaDomain.Script}/turn_on`)();
            sleep(1000);
            await this.turnOff();

            resolve();
        });
    }
}