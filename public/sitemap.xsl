<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DocTransfer.app - XML Sitemap</title>
        <!-- Load premium fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&amp;family=Plus+Jakarta+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet" />
        
        <style>
          :root {
            --bg-base: #06060c;
            --bg-surface: rgba(17, 17, 28, 0.7);
            --bg-card: rgba(25, 25, 45, 0.45);
            --border-glow: rgba(99, 102, 241, 0.15);
            --border-light: rgba(255, 255, 255, 0.08);
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --primary: #6366f1;
            --primary-gradient: linear-gradient(135deg, #6366f1 0%, #38bdf8 100%);
            --accent: #a855f7;
            --success: #10b981;
            --success-glow: rgba(16, 185, 129, 0.15);
            --warning: #f59e0b;
            --warning-glow: rgba(245, 158, 11, 0.15);
            --radius-lg: 16px;
            --radius-md: 12px;
            --radius-sm: 8px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            background-color: var(--bg-base);
            color: var(--text-primary);
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            padding: 2.5rem 1.5rem;
            position: relative;
            overflow-x: hidden;
          }

          /* Ambient Glow Backgrounds */
          body::before {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            top: -150px;
            left: -150px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
            z-index: -1;
            pointer-events: none;
          }

          body::after {
            content: '';
            position: absolute;
            width: 450px;
            height: 450px;
            bottom: -150px;
            right: -150px;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0) 70%);
            z-index: -1;
            pointer-events: none;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          /* Header Styling */
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .logo-area {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .logo-icon {
            width: 42px;
            height: 42px;
            background: var(--primary-gradient);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
            font-weight: 800;
            font-size: 1.25rem;
            color: #ffffff;
            font-family: 'Outfit', sans-serif;
          }

          .logo-text {
            font-family: 'Outfit', sans-serif;
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.03em;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .sitemap-badge {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-light);
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-size: 0.875rem;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
          }

          .badge-dot {
            width: 8px;
            height: 8px;
            background-color: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--success);
          }

          /* Description/Explainer Card */
          .info-card {
            background: var(--bg-surface);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            padding: 1.75rem;
            margin-bottom: 2rem;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
            border-left: 4px solid #6366f1;
          }

          .info-card h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
          }

          .info-card p {
            font-size: 0.95rem;
            line-height: 1.6;
            color: var(--text-secondary);
          }

          .info-card a {
            color: #38bdf8;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px dashed rgba(56, 189, 248, 0.4);
            transition: var(--transition);
          }

          .info-card a:hover {
            color: #6366f1;
            border-bottom-color: #6366f1;
          }

          /* Stats Section */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.25rem;
            margin-bottom: 2rem;
          }

          .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-md);
            padding: 1.5rem;
            text-align: left;
            transition: var(--transition);
            position: relative;
            overflow: hidden;
          }

          .stat-card:hover {
            border-color: var(--border-glow);
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(99, 102, 241, 0.08);
          }

          .stat-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
            margin-bottom: 0.5rem;
          }

          .stat-val {
            font-family: 'Outfit', sans-serif;
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--text-primary);
          }

          /* Filter and Search Bar */
          .action-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .search-wrapper {
            position: relative;
            flex-grow: 1;
            max-width: 500px;
          }

          .search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-light);
            padding: 0.75rem 1rem 0.75rem 2.75rem;
            border-radius: var(--radius-md);
            color: var(--text-primary);
            font-size: 0.95rem;
            transition: var(--transition);
            font-family: inherit;
          }

          .search-input:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.05);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
          }

          .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            pointer-events: none;
            width: 18px;
            height: 18px;
          }

          .results-info {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
          }

          /* Table Styling */
          .table-container {
            background: var(--bg-surface);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }

          th {
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--border-light);
            padding: 1.25rem 1.5rem;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
          }

          td {
            padding: 1.1rem 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            font-size: 0.925rem;
            color: var(--text-primary);
            vertical-align: middle;
            transition: var(--transition);
          }

          tr {
            transition: var(--transition);
          }

          tr:hover td {
            background: rgba(99, 102, 241, 0.04);
          }

          tr:last-child td {
            border-bottom: none;
          }

          /* Row Index */
          .col-index {
            color: var(--text-muted);
            font-weight: 500;
            width: 60px;
          }

          /* Loc Link styling */
          .col-loc a {
            color: #38bdf8;
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
            word-break: break-all;
          }

          .col-loc a:hover {
            color: #6366f1;
            padding-left: 4px;
          }

          /* Priority Visual Bar and Badge */
          .priority-wrapper {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 160px;
          }

          .priority-val {
            font-weight: 600;
            font-size: 0.875rem;
            width: 28px;
            font-family: 'Outfit', sans-serif;
          }

          .priority-bar-bg {
            height: 6px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 10px;
            flex-grow: 1;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.02);
          }

          .priority-bar-fill {
            height: 100%;
            border-radius: 10px;
          }

          .priority-high {
            color: var(--success);
          }
          .priority-high-bg {
            background: var(--success);
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
          }

          .priority-med {
            color: #38bdf8;
          }
          .priority-med-bg {
            background: #38bdf8;
            box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
          }

          .priority-low {
            color: var(--warning);
          }
          .priority-low-bg {
            background: var(--warning);
            box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
          }

          /* ChangeFreq Badge */
          .freq-badge {
            display: inline-block;
            padding: 0.25rem 0.65rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            border: 1px solid transparent;
          }

          .freq-daily {
            background: var(--success-glow);
            color: var(--success);
            border-color: rgba(16, 185, 129, 0.2);
          }

          .freq-weekly {
            background: rgba(56, 189, 248, 0.1);
            color: #38bdf8;
            border-color: rgba(56, 189, 248, 0.2);
          }

          .freq-monthly {
            background: rgba(168, 85, 247, 0.1);
            color: var(--accent);
            border-color: rgba(168, 85, 247, 0.2);
          }

          .freq-other {
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-secondary);
            border-color: var(--border-light);
          }

          /* Last Mod Date */
          .col-lastmod {
            color: var(--text-secondary);
            font-family: 'Outfit', sans-serif;
            font-size: 0.875rem;
            width: 140px;
          }

          /* Footer */
          footer {
            margin-top: 3rem;
            text-align: center;
            font-size: 0.85rem;
            color: var(--text-muted);
            border-top: 1px solid var(--border-light);
            padding-top: 1.5rem;
          }
          
          footer a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
          }
          
          footer a:hover {
            color: var(--primary);
          }

          /* Responsive Tweaks */
          @media (max-width: 768px) {
            body {
              padding: 1.5rem 1rem;
            }
            header {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }
            .action-bar {
              flex-direction: column;
              align-items: stretch;
            }
            .search-wrapper {
              max-width: 100%;
            }
            th:nth-child(4), td:nth-child(4),
            th:nth-child(5), td:nth-child(5) {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="logo-area">
              <div class="logo-icon">DT</div>
              <div class="logo-text">DocTransfer</div>
            </div>
            <div class="sitemap-badge">
              <span class="badge-dot"></span>
              XML Sitemap Dashboard
            </div>
          </header>

          <div class="info-card">
            <h2>About This Sitemap</h2>
            <p>
              This XML Sitemap contains <strong id="total-count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs that represent indexable contents for the DocTransfer website. This file is generated dynamically for search engines (like Google or Bing) to assist them in crawling and indexing the website accurately. By using this XSL stylesheet, we are presenting the sitemap content in a human-readable structure. Learn more about sitemaps at <a href="https://sitemaps.org" target="_blank" rel="noopener">sitemaps.org</a>.
            </p>
          </div>

          <!-- Statistics Summary Widgets -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Indexed Pages</div>
              <div class="stat-val"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Primary Landing Pages</div>
              <div class="stat-val"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority = '1.0'])"/></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">High Priority Pages (≥0.8)</div>
              <div class="stat-val"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority &gt;= '0.8'])"/></div>
            </div>
          </div>

          <!-- Interaction Bar -->
          <div class="action-bar">
            <div class="search-wrapper">
              <!-- Magnifying Glass Icon -->
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" id="search-input" class="search-input" placeholder="Search pages by URL (e.g., pricing, templates)..." onkeyup="filterTable()" />
            </div>
            <div class="results-info">
              Showing <span id="visible-count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span> of <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> pages
            </div>
          </div>

          <!-- Main Sitemap Table -->
          <div class="table-container">
            <table id="sitemap-table">
              <thead>
                <tr>
                  <th class="col-index">#</th>
                  <th>URL (Location)</th>
                  <th>Priority</th>
                  <th>Change Freq</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <!-- Sort from highest priority down to lowest, then sort by URL -->
                  <xsl:sort select="sitemap:priority" order="descending" data-type="number"/>
                  <xsl:sort select="sitemap:loc" order="ascending"/>
                  <tr>
                    <td class="col-index">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td class="col-loc">
                      <a href="{sitemap:loc}" target="_blank">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <div class="priority-wrapper">
                        <!-- Priority Color Assignment -->
                        <xsl:choose>
                          <xsl:when test="sitemap:priority = '1.0'">
                            <span class="priority-val priority-high"><xsl:value-of select="sitemap:priority"/></span>
                            <div class="priority-bar-bg">
                              <div class="priority-bar-fill priority-high-bg" style="width: 100%;"></div>
                            </div>
                          </xsl:when>
                          <xsl:when test="sitemap:priority &gt;= '0.8'">
                            <span class="priority-val priority-med"><xsl:value-of select="sitemap:priority"/></span>
                            <div class="priority-bar-bg">
                              <div class="priority-bar-fill priority-med-bg" style="width: {sitemap:priority * 100}%;"></div>
                            </div>
                          </xsl:when>
                          <xsl:otherwise>
                            <span class="priority-val priority-low"><xsl:value-of select="sitemap:priority"/></span>
                            <div class="priority-bar-bg">
                              <div class="priority-bar-fill priority-low-bg" style="width: {sitemap:priority * 100}%;"></div>
                            </div>
                          </xsl:otherwise>
                        </xsl:choose>
                      </div>
                    </td>
                    <td>
                      <!-- Change Frequency Badges -->
                      <xsl:choose>
                        <xsl:when test="sitemap:changefreq = 'daily'">
                          <span class="freq-badge freq-daily">daily</span>
                        </xsl:when>
                        <xsl:when test="sitemap:changefreq = 'weekly'">
                          <span class="freq-badge freq-weekly">weekly</span>
                        </xsl:when>
                        <xsl:when test="sitemap:changefreq = 'monthly'">
                          <span class="freq-badge freq-monthly">monthly</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="freq-badge freq-other"><xsl:value-of select="sitemap:changefreq"/></span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td class="col-lastmod">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            Generated for <a href="https://doctransfer.app" target="_blank">DocTransfer.app</a>. Stylesheet developed by Antigravity.
          </footer>
        </div>

        <!-- Client-Side Table Filter Script -->
        <script type="text/javascript">
          <![CDATA[
          function filterTable() {
            var input = document.getElementById('search-input');
            var filter = input.value.toLowerCase();
            var table = document.getElementById('sitemap-table');
            var tr = table.getElementsByTagName('tr');
            var visibleCount = 0;

            for (var i = 1; i < tr.length; i++) {
              var td = tr[i].getElementsByTagName('td')[1]; // Location column index 1
              if (td) {
                var txtValue = td.textContent || td.innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                  visibleCount++;
                } else {
                  tr[i].style.display = "none";
                }
              }
            }
            document.getElementById('visible-count').textContent = visibleCount;
          }
          ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
