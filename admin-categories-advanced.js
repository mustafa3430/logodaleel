// Advanced Categories Manager - Lazy Loaded Module
// This module is loaded on demand when the advanced categories manager is opened

console.log('🔧 Loading Advanced Categories Manager module...');

// Advanced Categories Manager Functions
window.advancedCategoriesManager = {
    isLoaded: false,
    
    // Initialize the advanced manager
    init: function() {
        if (this.isLoaded) {
            console.log('🔧 Advanced Categories Manager already initialized');
            return;
        }
        
        console.log('🔧 Initializing Advanced Categories Manager...');
        this.loadAdvancedInterface();
        this.setupAdvancedEventListeners();
        this.isLoaded = true;
        console.log('✅ Advanced Categories Manager initialized successfully');
    },
    
    // Load the advanced interface
    loadAdvancedInterface: function() {
        const modalContent = document.getElementById('advancedManagerContent');
        if (!modalContent) return;
        
        modalContent.innerHTML = `
            <div class="advanced-manager-interface">
                <div class="advanced-controls">
                    <div class="control-group">
                        <h3>📊 Categories Analytics</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-number" id="totalCatsAdvanced">0</span>
                                <span class="stat-label">Total Categories</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="activeCatsAdvanced">0</span>
                                <span class="stat-label">Active</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="inactiveCatsAdvanced">0</span>
                                <span class="stat-label">Inactive</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <h3>🔧 Advanced Tools</h3>
                        <div class="advanced-buttons">
                            <button class="btn btn-primary" onclick="advancedCategoriesManager.bulkImport()">
                                <i class="fas fa-upload"></i> Bulk Import
                            </button>
                            <button class="btn btn-success" onclick="advancedCategoriesManager.exportCategories()">
                                <i class="fas fa-download"></i> Export All
                            </button>
                            <button class="btn btn-warning" onclick="advancedCategoriesManager.validateCategories()">
                                <i class="fas fa-check-circle"></i> Validate
                            </button>
                            <button class="btn btn-info" onclick="advancedCategoriesManager.optimizeCategories()">
                                <i class="fas fa-magic"></i> Optimize
                            </button>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <h3>🔍 Advanced Search & Filter</h3>
                        <div class="advanced-search">
                            <input type="text" id="advancedSearchInput" placeholder="Advanced search with regex support..." class="form-control">
                            <label>
                                <input type="checkbox" id="useRegexSearch"> Use Regex
                            </label>
                            <label>
                                <input type="checkbox" id="searchKeywords"> Include Keywords
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="advanced-categories-table">
                    <div class="table-controls">
                        <button class="btn btn-sm btn-secondary" onclick="advancedCategoriesManager.expandAllRows()">
                            <i class="fas fa-expand-alt"></i> Expand All
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="advancedCategoriesManager.collapseAllRows()">
                            <i class="fas fa-compress-alt"></i> Collapse All
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="advancedCategoriesManager.addNewCategory()">
                            <i class="fas fa-plus"></i> Add Category
                        </button>
                    </div>
                    
                    <div id="advancedCategoriesTableContainer" class="table-container">
                        <table class="advanced-categories-table" id="advancedCategoriesTable">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Level 1</th>
                                    <th>Level 2</th>
                                    <th>Level 3</th>
                                    <th>Keywords</th>
                                    <th>Status</th>
                                    <th>Usage Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="advancedCategoriesTableBody">
                                <!-- Advanced categories will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        this.loadAdvancedData();
    },
    
    // Setup event listeners for advanced features
    setupAdvancedEventListeners: function() {
        const searchInput = document.getElementById('advancedSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.performAdvancedSearch();
            });
        }
        
        const regexCheckbox = document.getElementById('useRegexSearch');
        if (regexCheckbox) {
            regexCheckbox.addEventListener('change', () => {
                this.performAdvancedSearch();
            });
        }
    },
    
    // Load data for advanced manager
    loadAdvancedData: function() {
        console.log('📊 Loading advanced categories data...');
        
        // Get categories from the main system
        const categories = typeof getBusinessCategories === 'function' ? getBusinessCategories() : [];
        console.log('📊 Found', categories.length, 'categories for advanced manager');
        
        // Update stats
        this.updateAdvancedStats(categories);
        
        // Load table
        this.loadAdvancedTable(categories);
    },
    
    // Update statistics in advanced manager
    updateAdvancedStats: function(categories) {
        const totalCats = document.getElementById('totalCatsAdvanced');
        const activeCats = document.getElementById('activeCatsAdvanced');
        const inactiveCats = document.getElementById('inactiveCatsAdvanced');
        
        if (totalCats) totalCats.textContent = categories.length;
        
        const activeCount = categories.filter(cat => cat.active !== false).length;
        if (activeCats) activeCats.textContent = activeCount;
        if (inactiveCats) inactiveCats.textContent = categories.length - activeCount;
    },
    
    // Load advanced table
    loadAdvancedTable: function(categories) {
        const tbody = document.getElementById('advancedCategoriesTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        categories.forEach((category, index) => {
            const row = this.createAdvancedCategoryRow(category, index);
            tbody.appendChild(row);
        });
    },
    
    // Create advanced category row
    createAdvancedCategoryRow: function(category, index) {
        const row = document.createElement('tr');
        row.className = category.active === false ? 'inactive-category' : '';
        
        // Get usage count (mock for now)
        const usageCount = Math.floor(Math.random() * 50);
        
        row.innerHTML = `
            <td>
                <input type="checkbox" class="category-select" data-index="${index}">
            </td>
            <td>
                <strong>${category.level1?.en || category.name?.split(' > ')[0] || 'N/A'}</strong>
                <br><small class="text-muted">${category.level1?.ar || ''}</small>
            </td>
            <td>
                ${category.level2?.en || category.name?.split(' > ')[1] || 'N/A'}
                <br><small class="text-muted">${category.level2?.ar || ''}</small>
            </td>
            <td>
                ${category.level3?.en || category.name?.split(' > ')[2] || 'N/A'}
                <br><small class="text-muted">${category.level3?.ar || ''}</small>
            </td>
            <td>
                <small class="keywords-preview">
                    ${this.getKeywordsPreview(category)}
                </small>
            </td>
            <td>
                <span class="status-badge ${category.active === false ? 'inactive' : 'active'}">
                    ${category.active === false ? 'Inactive' : 'Active'}
                </span>
            </td>
            <td>
                <span class="usage-count">${usageCount}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="advancedCategoriesManager.editCategory(${index})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="advancedCategoriesManager.deleteCategory(${index})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="advancedCategoriesManager.duplicateCategory(${index})" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    },
    
    // Get keywords preview
    getKeywordsPreview: function(category) {
        const keywords = [];
        if (category.level1?.keywords) keywords.push(...category.level1.keywords);
        if (category.level2?.keywords) keywords.push(...category.level2.keywords);
        if (category.level3?.keywords) keywords.push(...category.level3.keywords);
        
        if (keywords.length === 0) return 'No keywords';
        
        const preview = keywords.slice(0, 3).join(', ');
        return keywords.length > 3 ? preview + '...' : preview;
    },
    
    // Advanced search functionality
    performAdvancedSearch: function() {
        const searchInput = document.getElementById('advancedSearchInput');
        const useRegex = document.getElementById('useRegexSearch')?.checked;
        const searchKeywords = document.getElementById('searchKeywords')?.checked;
        
        if (!searchInput) return;
        
        const query = searchInput.value.trim();
        if (!query) {
            this.loadAdvancedData(); // Reset to show all
            return;
        }
        
        console.log('🔍 Performing advanced search:', query, { useRegex, searchKeywords });
        
        // Implementation would go here for advanced search
        // For now, just show a message
        const tbody = document.getElementById('advancedCategoriesTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <i class="fas fa-search"></i>
                        Advanced search results for: "${query}"
                        <br><small>Feature in development</small>
                    </td>
                </tr>
            `;
        }
    },
    
    // Placeholder functions for advanced features
    bulkImport: function() {
        alert('Bulk Import feature - Coming soon!');
    },
    
    exportCategories: function() {
        alert('Export All Categories feature - Coming soon!');
    },
    
    validateCategories: function() {
        alert('Validate Categories feature - Coming soon!');
    },
    
    optimizeCategories: function() {
        alert('Optimize Categories feature - Coming soon!');
    },
    
    expandAllRows: function() {
        console.log('🔧 Expanding all category rows');
    },
    
    collapseAllRows: function() {
        console.log('🔧 Collapsing all category rows');
    },
    
    addNewCategory: function() {
        alert('Add New Category from Advanced Manager - Coming soon!');
    },
    
    editCategory: function(index) {
        alert(`Edit category at index ${index} - Coming soon!`);
    },
    
    deleteCategory: function(index) {
        if (confirm(`Delete category at index ${index}?`)) {
            alert('Delete functionality - Coming soon!');
        }
    },
    
    duplicateCategory: function(index) {
        alert(`Duplicate category at index ${index} - Coming soon!`);
    }
};

console.log('✅ Advanced Categories Manager module loaded successfully');
