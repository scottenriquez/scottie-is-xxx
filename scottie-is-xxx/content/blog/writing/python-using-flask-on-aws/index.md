---
title: Getting Started with Python and Flask on AWS
date: "2015-12-13T22:12:03.284Z"
description: "A quick guide for getting a RESTful API set up using Flask on Amazon Web Services."
---

# Getting Started: Convention Over Configuration

This software development paradigm has become prevalent in many modern frameworks and tools. It can be described as streamlining and standardizing aspects of development similar to all or most projects while specifying configurations for those that deviate from the established convention. For example, most Node.js developers call their main file `server.js`. Let’s say that I want to write a generic deployment script for Node.js applications. It’s much easier to include a simple command like `node server.js` than to try to determine the developer’s intended start file. This simple agreement saves a great deal of time and configuration details. The emphasis of this paradigm is that the knowledge will hold for any team or company, and so organizations full of old tribal knowledge become a thing of the past.

Personally, I’m a huge proponent of convention over configuration. Amazon Web Services use this paradigm as well as part of their Platform as a Service offerings, but unfortunately the documentation is sparse, which is the main downfall of convention over configuration. Simply put, if no one knows about your convention or which conventions you’re opting to use, it’s ultimately useless. Soapbox aside, I’m going to cover how I got my initial Python environment setup and some conventions necessary for successful deployment.

# Setting Up a Python Environment Using Elastic Beanstalk

I initially tried to use [this guide from Amazon](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-flask.html) to deploy a simple RESTful service built with Flask. I’m not an infrastructure person at all, so I struggled through the steps. I failed to produce anything meaningful, so I decided to switch up my approach. One odd thing about this documentation, other than the fact that it was created in 2010, is that this seems to be the Infrastructure as a Service approach. The instructions have you provisioning an EC2 instance and creating your own virtual environment, then manually starting and stopping Elastic Beanstalk. As a developer, I like being abstracted from all of that whenever possible, so I decided to use the Platform as a Service approach instead.

The first step is to create your application using Elastic Beanstalk via the AWS Management Console. When you create your new application, AWS will automatically create an EC2 instance for your application to reside on. During this initial setup, you can specify what predefined configuration you want to use such as Python, Node.js, and PHP. For the sake of this demo, choose Python. Once you choose the rest of your options, most of which are overkill for this simple demo, AWS will create your application within a few minutes.

# Configuring Your Local Machine

While your application and EC2 instance are being provisioned, start preparing your local machine. First of all, [install the Elastic Beanstalk command line tools via pip](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) or Homebrew if using Mac. Secondly, [create an IAM user](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) and [store your credentials locally](http://docs.aws.amazon.com/aws-sdk-php/v2/guide/credentials.html#using-the-aws-credentials-file-and-credential-profiles) so that they are not present in source code. Note that you can manage the roles and permissions for all users in the Identity and Access Management section of the AWS console. For the sake of this demo, be sure to grant the user the full S3 and Elastic Beanstalk access policies.

# Testing the Code Locally

I have created a Python 2.7 demo for this post on hosted the code in [this GitHub repository](https://github.com/scottenriquez/scottie-io-python-aws-demo). You can clone the code using the following command in the desired directory: `git clone git@github.com:scottenriquez/scottie-io-python-aws-demo.git`. I've also included the source code below for convenience.

### `application.py`

```python
from flask import Flask, request, url_for, jsonify
from boto.s3.key import Key
import boto
import boto.s3.connection
import uuid

application = Flask(__name__)

@application.route("/data/", methods = ["POST"])
def data():
	try:
		data = request.form["data"]
		connection = boto.connect_s3()
		#update with your S3 bucket name here
		bucket_name = "test"
		bucket = connection.get_bucket(bucket_name, validate = False)
		key = Key(bucket)
		guid = uuid.uuid4()
		key.key = guid
		key.set_contents_from_string(data)
		key.make_public()
		return jsonify({"status" : "success"}), 201
	except Exception as exception:
		return jsonify({"status" : "error", "message" : str(exception)}), 500

if __name__ == "__main__":
	application.run()
```

### `requirements.txt`

```python
flask==0.10.1
uuid==1.30
boto==2.38.0
```

After obtaining the code, make sure the proper dependencies are installed on your machine. This demo requires three pip packages: Flask, UUID, and Boto. Be sure to create an S3 bucket and update the code to target your desired bucket. Once all of this is configured, you can run the code using the command `python application.py`.

This code creates a simple RESTful service that takes raw data and stores it as an S3 file with a universally unique identifier for the name. To test the code, use a REST client like Postman to perform an HTTP POST on http://localhost:5000/data/ with the parameter called `data` containing the data to be posted to S3. The service will return a JSON message with either a status of `"success"` or an exception message if something went wrong.

# Deploying to Elastic Beanstalk

It’s important to note that the names of the two files cannot be changed. As mentioned in the first paragraph, AWS uses convention over configuration. When deploying, Elastic Beanstalk searches for a file called `application.py` to run. The other file is used to manage dependencies. If you didn’t have the three required pip packages on your local machine, you simply fetched them. Due to autoscaling and other factors, you can’t guarantee that the server that your code is deployed to contains the packages that your code depend on prior to deployment. Because of this, rather than using SSH to connect to an EC2 instance and executing several `pip install` commands for every new instance, it's best to list of all dependent packages and versions inside of a file called `requirements.txt`. This way whenever the code is deployed to a new EC2 instance, the build process knows which packages to fetch and install.

Once the code is working locally, we’re ready to deploy to AWS. Start by running the `eb init` command in the code’s directory. Be sure to choose the same region that was specified when the Elastic Beanstalk application was created. You can verify that the environment was created properly by running the command `eb list` or simply run `eb` for a list of all available commands. After initialization, execute `eb deploy`. The status of the deployment can be monitored via the command line or the AWS console. Once the deployment is completed, testing can be done via the same REST client, but substitute the localhost URL for the Elastic Beanstalk specified one.

You now have a working Python REST service on AWS!
