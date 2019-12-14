# Installing Sequent to PCF (Pivotal Cloud Foundry)

- Edit the manifest file changing the application name to whatever you'd like
- Create a credential UPS named _sequent-db_ in your target space.

From the src folder:
```meteor build ../PCF/. --server-only --architecture os.linux.x86_64```

Then ``` cf push ``` from the PCF folder.

You can also use docker - see [deploying meteor apps to cloud foundry](https://www.meshcloud.io/en/2018/02/14/deploying-meteor-apps-on-cloud-foundry/) for more information.
