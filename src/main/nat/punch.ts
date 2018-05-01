/**
 * Nat hole punching with support for uPnP, PMP and PCP in that order
 *
 * @class PortController
 */
class PortController {

    private portControl: any;

    constructor() {
        this.portControl = require("nat-puncher");
    }

    public async setup() {
        // Probe protocol support
        return await this.portControl.probeProtocolSupport();
    }

    public async addPortMapping(internalPort: number, externalPort: number, lifetime: number) {
        // Map internal port to external port for a given ms lifetime
        return await this.portControl.addMapping(internalPort, externalPort, lifetime);
    }

    public async deletePortMapping(externalPort: number) {
        // Map internal port to external port for a given ms lifetime
        return await this.portControl.deleteMapping(externalPort);
    }

    public async getActivePortMapping() {
        // Map internal port to external port for a given ms lifetime
        return await this.portControl.getActiveMappings();
    }
}

export default PortController;

