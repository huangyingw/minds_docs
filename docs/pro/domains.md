---
id: domains
title: Domains
---

Pro sites can use custom domains. This page contains information for how to configure your custom domain for Minds Pro.

## Configuring

1. Navigation to your [Pro Settings > Domain](https://www.minds.com/pro/me/settings/domain)
2. Enter your domain and click save
3. Follow the DNS steps below.

> Note: You can only have one domain per Pro site. Changing your domain will invalidate the previous domain.

## DNS (CNAME)

```
YOUR.DOMAIN.NAME CNAME pro-traefik.minds.com.
```

> Note: CNAME records can only be created for subdomains. If you wish to use a root level domain then you should redirect your root level domain to `www`. If your DNS provider does not support this then please email info@minds.com for support.

## SSL

### Let's Encrypt

Minds uses Let's Encrypt for Pro site SSL. Let's Encrypt is a free, automated, and open certificate authority (CA) that gives digital certificates in order to enable HTTPS (SSL/TLS) for websites.

### Troubleshooting

It can take a few hours for newly registered domains to begin to work. If your site is still not working after 24 hours then pleade email info@minds.com.

## DNS Provider Guides

If your DNS Provider is not listed below then please let us know.

### Godaddy

#### Root level domain (work around)

1. Navigate to the "Manage your DNS" page
2. You should see something that looks like the following screenshot
   ![Godaddy DNS](assets/pro-domain-godaddy-dns.png "Godaddy DNS")
3. Modify your `www` CNAME record to point towards `pro-traefik.minds.com`
4. Scroll further down the page, you should see a section called 'Forwarding'
   ![Godaddy DNS](assets/pro-domain-godaddy-forwarding.png "Godaddy DNS")
5. Click "Add" next to "Domain" and select "https://www.YOURDOMAIN".
